"use client";

import { PDFDocument, rgb, degrees } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";

const ExamAnswerPage = () => {
  const { examName } = useParams() as { examName: string };
  const searchParams = useSearchParams();
  const examID = searchParams.get("examID")!;
  const isDownloaded = useRef(false); // To prevent double downloads

  useEffect(() => {
    const handleDownload = async () => {
      if (isDownloaded.current) return; // Prevent running the function again
      isDownloaded.current = true;

      try {
        const pdfUrl = `/answerFile/${examID}.pdf`;
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch the PDF file.");
        }

        const arrayBuffer = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        pdfDoc.registerFontkit(fontkit);
        const fontUrl = "/fonts/NotoSansThai-VariableFont_wdth,wght.ttf";
        const fontResponse = await fetch(fontUrl);
        if (!fontResponse.ok) {
          throw new Error("Failed to fetch the font file.");
        }

        const fontBytes = await fontResponse.arrayBuffer();
        const customFont = await pdfDoc.embedFont(fontBytes);

        const pages = pdfDoc.getPages();
        

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${decodeURIComponent(examName as string)}.pdf`;
        a.click();

        URL.revokeObjectURL(url);

        // Close the tab after the download
        window.close();
      } catch (error) {
        console.error("Error downloading the PDF:", error);
      }
    };

    handleDownload();
  }, [examID]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <p>Downloading your exam answer, please wait...</p>
    </div>
  );
};

export default ExamAnswerPage;
