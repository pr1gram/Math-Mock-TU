import React, { useEffect, useState } from "react";
import Image from "next/image";

interface ExamQuestionProps {
  examName: string;
  pointNumber: number;
}

const ExamQuestion: React.FC<ExamQuestionProps> = ({ examName, pointNumber }) => {
  return (
    <div className=" w-[290px] h-[290px] sm:w-[320px] sm:h-[320px] md:h-[370px] md:w-[370px] lg:w-[500px] lg:h-[500px] flex items-center rounded-[18px] border-2 border-[#b5b6c2]">
      <Image
            src={`/data/exam/${examName}/${pointNumber}.jpg`}
            alt="Exam Image"
            width={500}
            height={500}
            className="object-contain max-w-full h-auto p-1 pointer-events-none"
            priority={true}
          />
    </div>
  );
};

export default ExamQuestion;
