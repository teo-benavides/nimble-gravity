async function getCandidateByEmail(email: string): Promise<Candidate> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/candidates/get-by-email?email=${email}`);

    if (!response.ok) {
        throw new Error('Failed to fetch candidate');
    }

    return await response.json();
}
