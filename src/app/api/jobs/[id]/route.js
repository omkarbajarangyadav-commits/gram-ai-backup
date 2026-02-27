import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jobSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rateLimit';

export async function GET(request, { params }) {
    try {
        const isAllowed = await rateLimit(request);
        if (!isAllowed) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }

        const { id } = params;
        const supabase = createClient();

        const { data: job, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        return NextResponse.json(job, { status: 200 });
    } catch (error) {
        console.error('Job GET Error:', error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const isAllowed = await rateLimit(request);
        if (!isAllowed) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }

        const { id } = params;
        const body = await request.json();

        const parsedData = jobSchema.partial().safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
        }

        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Role-based Security: Enforced by RLS automatically
        // The query will fail or update 0 rows if the user is not the owner or admin
        const { data, error } = await supabase
            .from('jobs')
            .update(parsedData.data)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Job PATCH Error:', error);
        return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const isAllowed = await rateLimit(request);
        if (!isAllowed) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }

        const { id } = params;
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Job DELETE Error:', error);
        return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
    }
}
