"use client"

import { useState, useEffect } from 'react';
import { getCandidateByEmail } from '../lib/nimble-gravity-api';

interface JobData {
    id: string;
    title: string;
}

interface JobProps {
    jobId: string;
    title: string;
}

function Job({ jobId, title }: JobProps) {
    const [githubUrl, setGithubUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setMessage('');

        try {
            if (process.env.NEXT_PUBLIC_APPLICANT_EMAIL === undefined) {
                throw new Error('Applicant email not set!');
            }

            const candidate = await getCandidateByEmail(process.env.NEXT_PUBLIC_APPLICANT_EMAIL);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/candidate/apply-to-job`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uuid: candidate.uuid,
                    jobId: jobId,
                    candidateId: candidate.candidateId,
                    repoUrl: githubUrl,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit');
            }

            const data = await response.json();
            setMessage('Success!');
            setGithubUrl(''); // Clear input after success
        } catch (err) {
            setMessage('Error submitting application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-6 items-center gap-2">
            <div className="col-span-3 text-lg font-semibold whitespace-nowrap"
            >
                {title}
            </div>
            <input
                className="col-span-2 input"
                type="url"
                name="github-url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
            />
            <button
                className="col-span-1 btn preset-filled-primary-500"
                type="button"
                onClick={handleSubmit}
                disabled={loading || !githubUrl}
            >
                Submit
            </button>
        </div>
    );
}

export default function JobList() {
    const [jobs, setJobs] = useState<JobData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/get-list`);

                if (!response.ok) {
                    throw new Error('Failed to fetch jobs');
                }

                const data: JobData[] = await response.json();
                setJobs(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return <div className="flex flex-col border rounded-lg p-4">Loading...</div>;
    }

    if (error) {
        return <div className="flex flex-col border rounded-lg p-4">Error: {error}</div>;
    }

    return (
        <div className="flex flex-col border rounded-lg p-4 gap-4">
            {jobs.map((job) => (
                <Job key={job.id} jobId={job.id} title={job.title} />
            ))}
        </div>
    );
}
  