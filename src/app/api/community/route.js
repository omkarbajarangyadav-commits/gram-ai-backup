import { NextResponse } from 'next/server';
import { COMMUNITY_POSTS } from '@/data/mockData';

export async function GET() {
    return NextResponse.json({ posts: COMMUNITY_POSTS }, { status: 200 });
}
