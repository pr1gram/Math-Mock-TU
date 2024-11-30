import apiFunction from "@/components/api"
import ExamList from "@/components/exam/examList"
import { auth } from "@/api/auth"
import Link from "next/link"
import MyExamList from "@/components/exam/myExamList"

export default async function Home() {
  const session = await auth()
  const response = await apiFunction("GET", "/exams/examlists/", {}).catch((error) => ({
    data: { data: [] },
  }))
  const ExamLists = JSON.stringify(response.data.data)
  let myExamLists = { data: { data: [] } }
  if (session) {
    myExamLists = await apiFunction("GET", `/transaction/${session.user?.email}`, {})
  }
  const myExamListsJSON = JSON.stringify(myExamLists?.data?.data) || null

  return (
    <main className="w-screen overflow-hidden">
      <div className="  h-[62px] bg-[#0855c9]"></div>
      <div className=" flex justify-center items-center w-full h-[180px] sm:h-[380px] md:h-[417px] bg-gradient-to-b from-[#0855c9] to-[#2f7aeb]">
        <div className=" block text-white text-center">
          <div className="  text-5xl sm:text-[56px] md:text-7xl font-bold">ONE MATH</div>
          <div className=" text-xl sm:text-2xl font-normal ">แนะนำแนะนำแนะนำแนะนำแนะนำ</div>
        </div>
      </div>
      <div>
        <div className="text-[#383c4e] text-3xl font-bold ml-4 mt-5 ">การสอบทั้งหมด</div>
        <ExamList examListsJSON={ExamLists} myExamListsJSON={myExamListsJSON} />
      </div>
      <div className=" w-full border border-[#EBEBEB] mt-4"></div>
      <div>
        <div className="text-[#383c4e] text-3xl font-bold ml-4 mt-5">การสอบของฉัน</div>
        {session ? (
          myExamListsJSON ? (
            <MyExamList myExamListsJSON={myExamListsJSON} />
          ) : (
            <div className=" flex justify-center">
              <div className="text-[#383c4e] text-2xl font-bold ml-4 mt-2 py-36">
                ไม่มีการสมัครสอบ
              </div>
            </div>
          )
        ) : (
          <div className=" flex justify-center py-36">
            <div>
              <div>เข้าสู่ระบบเพื่อดูการสอบของคุณ</div>
              <div className=" flex justify-center mt-2">
                <Link
                  href="/auth"
                  className="bg-[#2F7AEB] rounded-full text-white font-bold px-4 py-2 "
                >
                  เข้าสู่ระบบ
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
