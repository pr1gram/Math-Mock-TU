"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

const ExamAnswerPage = () => {
  // useParams can return string or string[], so we handle both safely
  const params = useParams();
  const examName = params?.examName; 
  
  const isDownloaded = useRef(false);
  const [status, setStatus] = useState("Downloading your exam graph, please wait...");

  useEffect(() => {
    const testName =decodeURIComponent(examName as string);
    console.log("Downloading graph for exam:", testName);
    const handleDownload = async () => {
      // check if examName exists and if we already downloaded
      if (isDownloaded.current || !examName) return; 
      isDownloaded.current = true;

      try {
        // Handle array case for examName just in case
        const nameString = Array.isArray(examName) ? examName[0] : examName;
        const pdfUrl = `/examGraph/${testName}.png`;
        
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch the PDF file.");
        }

        // --- MAJOR FIX ---
        // You must await the blob() method from the response object
        // instead of wrapping the response object itself in a Blob constructor.
        const blob = await response.blob();
        // ----------------
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${decodeURIComponent(nameString)}.png`;

        // Append to body to ensure compatibility (required for Firefox)
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setStatus("Download started!");

      } catch (error) {
        console.error("Error downloading the PDF:", error);
        setStatus("Error downloading file. Please check if the file exists.");
        // Reset ref so they can try again if they refresh or logic allows
        isDownloaded.current = false; 
      }
    };

    handleDownload();
  }, [examName]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <p>{status}</p>
    </div>
  );
};

export default ExamAnswerPage;