import apiFunction from "@/components/api"
import { auth } from "@/api/auth"
import Link from "next/link"
import Left_Arrow from "@/vector/left_arrow"
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid"


const ScorePage = async ({ params }: { params: { ExamID: string } }) => {
  const { ExamID } = params
  const session = await auth()
  const response = await apiFunction("GET", `/exams/results/${session?.user?.email}/${ExamID}`, {})
  console.log("ScorePage response:", response.data)
  return (
    <main>
      <div className=" w-full h-[calc(100dvh)] bg-gradient-to-b from-[#0855CA] to-[#2F7AEB] items-center flex justify-center">
        <div className="flex justify-center">
          <div className="w-[250px] sm:w-[290px] md:w-[320px]">
            <Link href="/" className="inline-block mt-4">
              <div className="flex text-white items-center gap-1 w-fit">
                <Left_Arrow />
                <div>หน้าหลัก</div>
              </div>
            </Link>
            <div className="bg-white rounded-[9px] border border-[#b5b6c2] p-4 flex flex-col mt-1 duration-500">
              <div className=" text-center">
                คะแนนที่สอบได้
                <div className=" text-5xl">{response.data.data.score}</div>
                คะแนน
              </div>
              {response.data.data.Mean && <div className=" text-center">
                <div>
                  ค่าเฉลี่ย (Mean) {response.data.data.Mean}
                  คะแนน
                </div>
                <div>
                  ส่วนเบี่ยงเบนมาตรฐาน (SD) {response.data.data.SD}
                  คะแนน
                </div>
              </div>}
              <Link
                href={`/downloadgraph/${decodeURIComponent(ExamID)}`}
                className=" flex justify-center w-full border-2 text-white border-[#2F7AEB] bg-[#2F7AEB] rounded-full text-center py-1 my-2 "
                target="_blank"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                  ดาวน์โหลดกราฟคะแนน
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ScorePage
