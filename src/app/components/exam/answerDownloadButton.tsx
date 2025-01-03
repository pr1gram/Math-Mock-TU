"use client"

import { PDFDocument, rgb, degrees } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"

const AnswerDownloadButton = ({
  examName,
  examID,
}: {
  examName: string
  examID: string
}) => {
  const handleDownload = async () => {
    try {
      const pdfUrl = `/answerFile/${examID}.pdf`
      const response = await fetch(pdfUrl)
      if (!response.ok) {
        throw new Error("Failed to fetch the PDF file.")
      }

      const arrayBuffer = await response.arrayBuffer()

      // Load the PDF with pdf-lib
      const pdfDoc = await PDFDocument.load(arrayBuffer)

      // Embed a custom font (e.g., a font that supports Thai characters)
      pdfDoc.registerFontkit(fontkit)

      const fontUrl = "/fonts/NotoSansThai-VariableFont_wdth,wght.ttf" // Path to your custom font in the public folder
      const fontResponse = await fetch(fontUrl)
      if (!fontResponse.ok) {
        throw new Error("Failed to fetch the font file.")
      }

      const fontBytes = await fontResponse.arrayBuffer()
      const customFont = await pdfDoc.embedFont(fontBytes)

      // Add watermark to each page
      const pages = pdfDoc.getPages()

      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save()

      // Trigger the download
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      window.open(url, "_blank")

      const a = document.createElement("a")
      a.href = url
      a.download = `${examName}.pdf`
      a.click()

      URL.revokeObjectURL(url) // Clean up the URL object
    } catch (error) {
      console.error("Error downloading the PDF:", error)
    }
  }

  return (
    <button
      onClick={handleDownload}
      className="w-full border-2 text-white border-[#2F7AEB] bg-[#2F7AEB] rounded-full text-center py-1 mb-2"
    >
      เฉลยข้อสอบ
    </button>
  )
}

export default AnswerDownloadButton
