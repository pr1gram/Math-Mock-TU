import React from "react"
import Image from "next/image"

interface ExamQuestionProps {
  examName: string
  pointNumber: number
}

const ExamQuestion: React.FC<ExamQuestionProps> = ({ examName, pointNumber }) => {
  return (
    <div className="w-[290px] h-[290px] sm:w-[320px] sm:h-[320px] md:w-[370px] md:h-[370px] lg:w-[500px] lg:min-h-[500px] flex items-center justify-center rounded-[18px] border-2 border-[#b5b6c2] overflow-hidden">
      <Image
        src={`/data/exam/${examName}/${pointNumber}.png`}
        alt="Exam Image"
        width={700}
        height={700}
        className="object-contain w-full h-full zoomable-image"
        priority={true}
      />
    </div>
  )
}

export default ExamQuestion