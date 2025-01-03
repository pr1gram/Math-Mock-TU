"use client"

import { PDFDocument, rgb, degrees } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"

const ExamDownloadButton = ({
  examName,
  examID,
  userData,
  className
}: {
  examName: string
  examID: string
  userData: { firstname: string; lastname: string }
  className?: string
}) => {
  const handleDownload = async () => {
    try {
      const pdfUrl = `/examFile/${examID}.pdf`;
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the PDF file.");
      }
  
      const arrayBuffer = await response.arrayBuffer();
  
      // Load the PDF with pdf-lib
      const pdfDoc = await PDFDocument.load(arrayBuffer);
  
      // Embed a custom font (e.g., a font that supports Thai characters)
      pdfDoc.registerFontkit(fontkit);
  
      const fontUrl = "/fonts/NotoSansThai-VariableFont_wdth,wght.ttf"; // Path to your custom font in the public folder
      const fontResponse = await fetch(fontUrl);
      if (!fontResponse.ok) {
        throw new Error("Failed to fetch the font file.");
      }
  
      const fontBytes = await fontResponse.arrayBuffer();
      const customFont = await pdfDoc.embedFont(fontBytes);
  
      // Add watermark to each page
      const pages = pdfDoc.getPages();
      const watermarkText = `${userData.firstname} ${userData.lastname}`;
  
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 3,
          y: height / 2,
          size: 50,
          font: customFont,
          color: rgb(0.75, 0.75, 0.75), // Light gray
          rotate: degrees(45),
          opacity: 0.5,
        });
        page.drawText(watermarkText, {
          x: width / 3,
          y: height / 10,
          size: 50,
          font: customFont,
          color: rgb(0.75, 0.75, 0.75), // Light gray
          rotate: degrees(45),
          opacity: 0.5,
        });
      });
  
      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save();
  
      // Trigger the download
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
  
  
      const a = document.createElement("a");
      a.href = url;
      a.download = `${examName}_${userData.firstname}_${userData.lastname}.pdf`;
      a.click();
  
      URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    }
  };
  

  return (
    <button
      onClick={handleDownload}
      className={className}
    >
      <ArrowDownTrayIcon className="w-5 h-5" />
      ดาวน์โหลดข้อสอบ
    </button>
  )
}

export default ExamDownloadButton
