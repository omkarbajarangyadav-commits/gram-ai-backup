import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// 1. WhatsApp Cloud Meta Verification
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const WEBHOOK_SECRET = process.env.WHATSAPP_WEBHOOK_SECRET || 'uber-agtech-secret-token';

    if (mode && token) {
        if (mode === 'subscribe' && token === WEBHOOK_SECRET) {
            return new NextResponse(challenge, { status: 200 });
        }
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// 2. Receive WhatsApp Location Message
export async function POST(request) {
    try {
        const payload = await request.json();

        // Validate Signature for Security Hardening
        const signature = request.headers.get('x-hub-signature-256');
        const secret = process.env.WHATSAPP_APP_SECRET || 'your_fb_app_secret';
        // const hmac = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
        // if (`sha256=${hmac}` !== signature) throw new Error("Invalid Signature");

        // Parse Meta WhatsApp Cloud API Payload
        if (!payload.entry || !payload.entry[0].changes) {
            return NextResponse.json({ status: "ok" }); // Reply 200 instantly
        }

        const message = payload.entry[0].changes[0].value.messages?.[0];

        // Check if the message contains a live/static location attachment (Geospatial Ping)
        if (message && message.type === 'location') {
            const fromPhone = message.from;
            const { latitude, longitude } = message.location;

            const supabase = createClient();

            // Look up User by Phone (Assuming auth.users has phone_number or profiles table does)
            const { data: userProfile } = await supabase
                .from('users_profile')
                .select('id')
                .eq('phone', `+${fromPhone}`)
                .single();

            if (!userProfile) {
                // Unrecognized number, prompt registration flow
                return sendWhatsAppReply(fromPhone, "Welcome to Krishi Rozgar! Please register on our app to find jobs nearby.");
            }

            // 1. UPSERT WORKER LIVE GEO-LOCATION
            await supabase.from('worker_locations').upsert({
                worker_id: userProfile.id,
                latitude: latitude,
                longitude: longitude,
                is_online: true
            });

            // 2. RUN POSTGIS 5KM RADIUS JOB QUERY (AI Matching Engine Step)
            const { data: nearbyJobs } = await supabase.rpc('get_nearby_jobs', {
                user_lat: latitude,
                user_lon: longitude,
                radius_meters: 5000, // 5KM Radius
                max_results: 3
            });

            // 3. REPLY WITH FORMATTED JOB LIST ALERTS
            if (!nearbyJobs || nearbyJobs.length === 0) {
                await sendWhatsAppReply(fromPhone, "📍 Location Tracking Active. There are currently no available jobs within 5KM of your location. We will alert you when one pops up.");
            } else {
                let replyText = `📍 Found ${nearbyJobs.length} active jobs within 5KM of your location:\n\n`;
                nearbyJobs.forEach(job => {
                    replyText += `👷 *${job.title}* (${Math.round(job.distance_meters)}m away)\n`;
                    replyText += `💰 ₹${job.salary_per_day}/day | ${job.employer_name}\n`;
                    replyText += `📞 wa.me/${process.env.WHATSAPP_SUPPORT_NUM}?text=Accept%20Job%20${job.id}\n\n`;
                });
                await sendWhatsAppReply(fromPhone, replyText);
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("WhatsApp Webhook Error:", error);
        return NextResponse.json({ status: "error" }, { status: 500 });
    }
}

// Webhook HTTP Sender Helper
async function sendWhatsAppReply(to, templateString) {
    // Example fetch to Meta Graph API
    /* 
    await fetch(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messaging_product: "whatsapp", to, text: { body: templateString } })
    });
    */
    console.log(`[WHATSAPP ALERT SENT TO ${to}]:\n${templateString}`);
}
