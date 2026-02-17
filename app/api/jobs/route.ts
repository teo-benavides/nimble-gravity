import { getJobs } from '@/app/lib/jobs.server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const jobs = await getJobs();

        return NextResponse.json(jobs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}