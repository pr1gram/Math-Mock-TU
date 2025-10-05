"use client"

import React, { useCallback } from "react"
import ClockIcon from "@/vector/exam/clockIcon"
import CalendarIcon from "@/vector/exam/calendarIcon"
import { DotButton, useDotButton } from "@/components/exam/carouselDot"
import useEmblaCarousel from "embla-carousel-react"
import LeftIcon from "@/vector/exam/leftIcon"
import RightIcon from "@/vector/exam/rightIcon"
import Link from "next/link"

const ExamList = ({ examListsJSON, myExamListsJSON }: { examListsJSON: any; myExamListsJSON: any }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  let examLists = [];
  let myExamLists = [];

  try {
    examLists = examListsJSON ? JSON.parse(examListsJSON) : [];
  } catch (error) {
    console.error("Error parsing examListsJSON:", error);
  }

  try {
    myExamLists = myExamListsJSON ? JSON.parse(myExamListsJSON) : [];
  } catch (error) {
    console.error("Error parsing myExamListsJSON:", error);
  }

  const filteredExamLists =
    Array.isArray(examLists) && Array.isArray(myExamLists)
      ? examLists.filter((exam: any) => {
          const matchingExams = myExamLists.filter(
            (myExam: any) => myExam.testID === exam.id || (exam.list && exam.list.includes(myExam.testID))
          );

          if (exam.pack) {
            const remainingCount = exam.list.length - matchingExams.length;
            return remainingCount >= exam.packQuantity;
          }

          return matchingExams.length === 0;
        })
      : examLists; // Return the original list if no filtering is possible

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex gap-5 mx-4">
          {filteredExamLists?.length ? (
            filteredExamLists.map((exam: any) => (
              <div
                key={exam.id}
                className="border-2 rounded-xl border-[#B5B6C2] aspect-square w-[224px] sm:w-[366px] p-4 sm:p-6 md:p-8 my-6 flex flex-col justify-between flex-shrink-0"
              >
                <div>
                  <div className="text-[#2F7AEB] font-bold text-2xl">{exam.title}</div>
                  <div className="text-[#383c4e] my-2">
                    <div className="flex gap-[2px] items-center">
                      <CalendarIcon className="h-6 w-6" />
                      {exam.date}
                    </div>
                    <div className="flex gap-[2px] items-center">
                      <ClockIcon className="h-6" />
                      {exam.duration} นาที
                    </div>
                  </div>
                  <div>{exam.description}</div>
                </div>
                <div className="mt-auto justify-center flex">
                  <Link href={`/register/${exam.id}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-full">สมัครสอบ</button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className=" text-[#383c4e] text-2xl font-bold ml-4 mt-2 py-36 w-full text-center">ไม่มีวิชาให้สมัครสอบในขณะนี้</div>
          )}
          {/* <div className=" text-[#383c4e] text-2xl font-bold ml-4 mt-2 py-36 w-full text-center">ไม่มีวิชาให้สมัครสอบในขณะนี้</div> */}
        </div>
      </div>
      {scrollSnaps.length > 1 && (
        <div className="w-full px-4 flex justify-between">
          <button className="" onClick={scrollPrev}>
            <LeftIcon className="h-6 sm:h-10" />
          </button>

          <div className="bg-[#EBEBEB] rounded-full px-2">
            <div className="flex">
              {scrollSnaps.map((_, index) => (
                <DotButton
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className={"embla__dot h-8 sm:h-10 w-6 sm:w-12 md:w-18 ".concat(
                    index === selectedIndex ? " embla__dot--selected" : ""
                  )}
                />
              ))}
            </div>
          </div>

          <button className="" onClick={scrollNext}>
            <RightIcon className="h-6 sm:h-10" />
          </button>
        </div>
      )}
    </div>
  );
};


export default ExamList
