import { getCandidateByEmail } from '@/app/lib/candidates.server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Get the URL search params from the request
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const candidate = await getCandidateByEmail(email);

        return NextResponse.json(candidate);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}