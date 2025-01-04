"use client"; // Required for client-side logic
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const MyExamTimer = ({ startTime }: { startTime: number }) => {
  const router = useRouter();

  useEffect(() => {
    const currentTime = Date.now();

    if (startTime > currentTime) {
      const timeout = setTimeout(() => {
        router.refresh(); // Refresh the page when the time arrives
      }, startTime - currentTime);
      return () => clearTimeout(timeout); // Cleanup the timeout
    }
  }, [startTime, router]);
  
  return null; // No UI for the timer
};

export default MyExamTimer;
