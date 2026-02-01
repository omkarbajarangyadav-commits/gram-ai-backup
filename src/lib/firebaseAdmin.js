import * as admin from 'firebase-admin';

let db;

try {
    if (!admin.apps.length) {
        if (process.env.FIREBASE_PRIVATE_KEY) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                }),
            });
            console.log('Firebase Admin Initialized');
        } else {
            console.warn('Firebase Admin: Missing private key. Using mock DB.');
        }
    }

    // If initialized successfully, use Firestore
    if (admin.apps.length) {
        db = admin.firestore();
    } else {
        // Mock DB implementation to prevent crashes
        db = {
            collection: () => ({
                doc: () => ({
                    set: async () => console.log('Mock DB: Document saved'),
                    id: 'mock-id-' + Date.now()
                }),
                add: async () => console.log('Mock DB: Document added'),
                count: () => ({ get: async () => ({ data: () => ({ count: 100 }) }) }),
                where: () => ({ orderBy: () => ({ limit: () => ({ get: async () => ({ docs: [], empty: true }) }) }) })
            })
        };
    }

} catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
    // Fallback Mock DB
    db = {
        collection: () => ({
            doc: () => ({
                set: async () => { },
                id: 'error-id'
            }),
            add: async () => { },
            count: () => ({ get: async () => ({ data: () => ({ count: 0 }) }) }),
            where: () => ({ orderBy: () => ({ limit: () => ({ get: async () => ({ docs: [], empty: true }) }) }) })
        })
    };
}

export { db };
