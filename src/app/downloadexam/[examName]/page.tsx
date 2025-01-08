"use client";

import { PDFDocument, rgb, degrees } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";

const ExamDownloadPage = () => {
  const { examName } = useParams() as { examName: string };
  const searchParams = useSearchParams();
  const examID = searchParams.get("examID")!;
  const firstname = searchParams.get("firstname")!;
  const lastname = searchParams.get("lastname")!;
  const watermarkText = `${firstname} ${lastname}`; // Dynamic watermark
  const isDownloaded = useRef(false); // To prevent double downloads

  useEffect(() => {
    const handleDownload = async () => {
      if (isDownloaded.current) return; // Prevent running the function again
      isDownloaded.current = true;

      try {
        const pdfUrl = `/examFile/${examID}.pdf`;
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
        pages.forEach((page) => {
          const { width, height } = page.getSize();
          page.drawText(watermarkText, {
            x: width / 3,
            y: height / 2,
            size: 50,
            font: customFont,
            color: rgb(0.75, 0.75, 0.75),
            rotate: degrees(45),
            opacity: 0.5,
          });
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${decodeURIComponent(examName as string)}_${firstname}_${lastname}.pdf`;
        a.click();

        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading the PDF:", error);
      }
    };

    handleDownload();
  }, [examID, watermarkText]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <p>Downloading your exam, please wait...</p>
    </div>
  );
};

export default ExamDownloadPage;
