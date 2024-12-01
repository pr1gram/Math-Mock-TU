import apiFunction from "@/components/api"
import { auth } from "@/api/auth"
import Link from "next/link"
import Left_Arrow from "@/vector/left_arrow"

const ScorePage = async ({ params }: { params: { ExamID: string } }) => {
  const { ExamID } = params
  const session = await auth()
  const response = await apiFunction("GET", `/exams/results/${session?.user?.email}/${ExamID}`, {})
  console.log(response.data)
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
                <div className=" text-5xl">
                    {response.data.data.score}
                </div>
                คะแนน
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ScorePage
