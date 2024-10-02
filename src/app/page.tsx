import { signIn, signOut, auth } from "@/api/auth"
import Image from "next/image"
import apiFunction from "@/components/api"
import ClockIcon from "./vector/exam/clockIcon"
import CalendarIcon from "./vector/exam/calendarIcon"
import Carousel from "react-multi-carousel"
import ExamList from "@/components/exam/examList"

export default async function Home() {
  const response = await apiFunction("GET", "/exams/examlists/", {}).catch((error) => ({
    data: { data: [] },
  }));
  const ExamLists =JSON.stringify(response.data.data)

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
          <ExamList examListsJSON={ExamLists} />
      </div>
    </main>
  )
}
