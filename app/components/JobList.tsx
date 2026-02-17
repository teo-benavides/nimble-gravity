"use client"

import { useState, useEffect } from 'react';
import { ApplyRequestBody } from '@/app/types/api';
import { JobData } from '@/app/types/jobs';

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
            const body: ApplyRequestBody = {
                email: process.env.NEXT_PUBLIC_APPLICANT_EMAIL || '',
                jobId: jobId,
                githubUrl: githubUrl,
            };

            const response = await fetch("api/apply", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Failed to apply');
            }

            setMessage('Success!');
            setGithubUrl('');
        } catch (err) {
            setMessage('Error submitting application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
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
            {message && <div className="text-sm mt-1 text-error-500">{message}</div>}
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
                const response = await fetch("api/jobs");

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
  