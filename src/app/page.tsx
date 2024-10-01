import { signIn, signOut, auth } from "@/api/auth"
import Image from "next/image"
import apiFunction from "@/components/api"
import ClockIcon from "./vector/exam/clockIcon"
import CalendarIcon from "./vector/exam/calendarIcon"

export default async function Home() {
  const examLists = await apiFunction("GET", "/exams/examlists/", {})
  console.log(examLists.data.data)
  return (
    <main>
      <div className="  h-[62px] bg-[#0855c9]"></div>
      <div className=" flex justify-center items-center w-full h-[180px] sm:h-[380px] md:h-[417px] bg-gradient-to-b from-[#0855c9] to-[#2f7aeb]">
        <div className=" block text-white text-center">
          <div className="  text-5xl sm:text-[56px] md:text-7xl font-bold">ONE MATH</div>
          <div className=" text-xl sm:text-2xl font-normal ">แนะนำแนะนำแนะนำแนะนำแนะนำ</div>
        </div>
      </div>
      <div>
        <div className="text-[#383c4e] text-3xl font-bold ml-4 mt-5">การสอบทั้งหมด</div>
        <div className=" flex gap-5 ml-4">
          {examLists.data.data.map((exam: any) => {
            return (
              <div
                key={exam.id}
                className=" border-2 rounded-xl border-[#B5B6C2] aspect-square w-[224px] sm:w-[366px] p-4 sm:p-6 md:p-8 my-6 flex flex-col justify-between"
              >
                <div>
                  <div className=" text-[#2F7AEB] font-bold text-3xl">{exam.title}</div>
                  <div className="text-[#383c4e] my-2">
                    <div className=" flex gap-[2px] ">
                      <CalendarIcon className=" h-6" />
                      {exam.date}
                    </div>
                    <div className=" flex gap-[2px] ">
                      <ClockIcon className=" h-6" />
                      {exam.duration} นาที
                    </div>
                  </div>
                  <div className="">{exam.description} </div>
                </div>
                <div className="mt-auto justify-center flex">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
                    สมัครสอบ
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
