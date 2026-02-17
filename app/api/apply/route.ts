import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body: ApplyRequestBody = await request.json();

        const candidate = await getCandidateByEmail(body.email);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/candidate/apply-to-job`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: candidate.uuid,
                jobId: body.jobId,
                candidateId: candidate.candidateId,
                repoUrl: body.githubUrl,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to submit');
        }

        const responseBody = await response.json();
        console.log(responseBody);

        return NextResponse.json({ message: 'Application submitted successfully' }, { status: 200 });
    }
    catch {
        return NextResponse.json({ error: 'Failed to apply' }, { status: 500 });
    }
}