"use client"

import React, { useCallback } from "react"
import ClockIcon from "@/vector/exam/clockIcon"
import CalendarIcon from "@/vector/exam/calendarIcon"
import { DotButton, useDotButton } from "@/components/exam/carouselDot"
import useEmblaCarousel from "embla-carousel-react"
import LeftIcon from "@/vector/exam/leftIcon"
import RightIcon from "@/vector/exam/rightIcon"
import Link from "next/link"
import PendingIcon from "@/vector/exam/pendingIcon"
import ApprovedIcon from "@/vector/exam/approvedIcon"
import RejectedIcon from "@/vector/exam/rejectedIcon"

const MyExamList = ({ myExamListsJSON }: { myExamListsJSON: any }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" })

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const myExamLists = JSON.parse(myExamListsJSON)

  return (
    <div className="embla ">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex gap-5 mx-4 ">
          {myExamLists?.length ? (
            myExamLists.map((myExam: any) => (
              <div
                key={myExam.testID}
                className="border-2 rounded-xl border-[#B5B6C2] aspect-square w-[224px] sm:w-[366px] p-4 sm:p-6 md:p-8 my-6 flex flex-col justify-between flex-shrink-0"
              >
                <div>
                  <div className="text-[#2F7AEB] font-bold text-2xl">{myExam.examData.title}</div>
                  <div className="text-[#383c4e] my-2">
                    <div className="flex gap-[2px] items-center ">
                      <CalendarIcon className="h-6 w-6" />
                      {myExam.examData.date}
                    </div>
                    <div className="flex gap-[2px] items-center">
                      <ClockIcon className="h-6" />
                      {myExam.examData.duration} นาที
                    </div>
                    <div className="flex gap-[2px] items-center">
                    {myExam.status === "approved" && (
                        <div className=" text-[#4ab361] flex">
                          <ApprovedIcon className="w-6" /> ผ่านการตรวจสอบ
                        </div>
                      )}
                      {myExam.status === "pending" && (
                        <div className=" text-[#F0B00C] flex">
                          <PendingIcon className="h-6" /> อยู่ระหว่างการตรวจสอบ
                        </div>
                      )}
                      {myExam.status === "rejected" && (
                        <div className=" text-red-600 flex">
                          <RejectedIcon className="h-6" /> ไม่ผ่านการตรวจสอบ
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="">{myExam.examData.description}</div>
                </div>
                <div className="mt-auto justify-center flex">
                  <Link href={`/myExam/${myExam.testID}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
                      ดูรายละเอียด
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div>No exams available</div>
          )}
        </div>
      </div>
      {scrollSnaps.length > 1 && (
        <div className=" w-full px-4 flex justify-between">
          <button className="" onClick={scrollPrev}>
            <LeftIcon className=" h-6 sm:h-10 " />
          </button>

          <div className=" bg-[#EBEBEB] rounded-full px-2">
            <div className=" flex">
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
            <RightIcon className=" h-6 sm:h-10" />
          </button>
        </div>
      )}
    </div>
  )
}

export default MyExamList
