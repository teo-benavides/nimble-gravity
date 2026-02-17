import { Candidate } from "@/app/types/candidate";

export async function getCandidateByEmail(email: string): Promise<Candidate> {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/candidate/get-by-email?email=${email}`;

    const response = await fetch(url);

    if (!response.ok) {
        console.error('Failed to fetch candidate');
        throw new Error('Failed to fetch candidate');
    }

    return await response.json();
}
