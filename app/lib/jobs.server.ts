import { JobData } from "@/app/types/jobs";

export async function getJobs(): Promise<JobData[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/get-list`);

    if (!response.ok) {
        throw new Error('Failed to fetch jobs');
    }

    return await response.json();
}