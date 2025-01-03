"use client";

import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const AnswerDownloadButton = ({
  examName,
  examID,
}: {
  examName: string;
  examID: string;
}) => {
  const handleDownload = async () => {
    try {
      const pdfUrl = `/answerFile/${examID}.pdf`;
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the PDF file.");
      }

      const arrayBuffer = await response.arrayBuffer();

      // Load the PDF with pdf-lib
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Embed a custom font (optional, used only if needed elsewhere)
      pdfDoc.registerFontkit(fontkit);
      const fontUrl = "/fonts/NotoSansThai-VariableFont_wdth,wght.ttf";
      const fontResponse = await fetch(fontUrl);
      if (!fontResponse.ok) {
        throw new Error("Failed to fetch the font file.");
      }

      const fontBytes = await fontResponse.arrayBuffer();
      await pdfDoc.embedFont(fontBytes);

      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save();

      // Trigger the download
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);


      // Optional: Trigger the download directly
      const a = document.createElement("a");
      a.href = url;
      a.download = `${examName}.pdf`;
      a.click();

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full border-2 text-white border-[#2F7AEB] bg-[#2F7AEB] rounded-full text-center py-1 mb-2"
    >
      เฉลยข้อสอบ
    </button>
  );
};

export default AnswerDownloadButton;
