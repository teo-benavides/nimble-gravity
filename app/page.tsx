import Image from "next/image";
import JobList from "./components/JobList";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <JobList />
    </div>
  );
}
