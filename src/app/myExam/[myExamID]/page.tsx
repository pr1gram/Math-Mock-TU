import apiFunction from "@/components/api"
import { auth } from "@/api/auth"
import { redirect } from "next/navigation"
import CalendarIcon from "@/vector/exam/calendarIcon"
import ClockIcon from "@/vector/exam/clockIcon"
import ApprovedIcon from "@/vector/exam/approvedIcon"
import PendingIcon from "@/vector/exam/pendingIcon"
import Left_Arrow from "@/vector/left_arrow"
import Link from "next/link"
import CheckSignIn from "@/components/auth/checkSignIn"
import RejectedIcon from "@/vector/exam/rejectedIcon"
import MyExamTimer from "@/components/exam/myExamTimer"

const MyExamPage = async ({ params }: { params: { myExamID: string } }) => {
  const { myExamID } = params
  const session = await auth()

  const checkSignIn = await CheckSignIn(false, "/auth")

  const haveAccountresponse = await apiFunction(
    "GET",
    `/authentication/${session?.user?.email}`,
    {}
  )
  if (haveAccountresponse.status === 400) {
    redirect("/form")
  }

  const response = await apiFunction("GET", `/transaction/${session?.user?.email}/${decodeURIComponent(myExamID)}`, {})
  if (response.status === 404) {
    redirect("/404")
  }

  const solutions = await apiFunction("GET", `/exams/solutions/${myExamID}`, {})
  const myExamData = response.data.data

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
              <div className="flex flex-col justify-between h-[380px] sm:h-[450px] md:h-[540px]">
                <div>
                  <div className="text-[#2f7aeb] text-3xl sm:text-4xl font-bold">
                    {myExamData?.examData.title}
                  </div>
                  <div className="my-3 text-[#383C4E]">
                    <div className="flex gap-[2px] items-center">
                      <CalendarIcon className="w-5 sm:w-7 text-base sm:text-lg" />
                      {myExamData.examData.date}
                    </div>
                    <div className="flex gap-[2px] items-center">
                      <ClockIcon className="w-5 sm:w-7 text-base sm:text-lg" />
                      {myExamData.examData.duration} นาที
                    </div>
                    <div className="flex gap-[2px] items-center">
                      {myExamData.status === "approved" && (
                        <div className=" text-[#4ab361] flex gap-[2px] items-center">
                          <ApprovedIcon className="w-5 sm:w-7" /> ผ่านการตรวจสอบ
                        </div>
                      )}
                      {myExamData.status === "pending" && (
                        <div className=" text-[#F0B00C] flex gap-[2px] items-center">
                          <PendingIcon className="w-5 sm:w-7" /> อยู่ระหว่างการตรวจสอบ
                        </div>
                      )}
                      {myExamData.status === "rejected" && (
                        <div className=" text-red-600 flex">
                          <RejectedIcon className="h-6" /> ไม่ผ่านการตรวจสอบ
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-base">{myExamData.examData.description}</div>
                </div>
                {myExamData.status === "approved" ? (
                  <div className="mt-4 flex justify-center text-[#B5B6C2]">
                    <div className=" w-full">
                      {Date.now() > myExamData.examData.startTime &&
                      Date.now() < myExamData.examData.endTime ? (
                        myExamData?.examsUserData?.submittedTime ? (
                          <div className=" w-full border-2 border-[#B5B6C2] rounded-full text-center py-1 my-2 ">
                            เริ่มต้นสอบ
                          </div>
                        ) : (
                          <div className=" w-full border-2 text-white border-[#2F7AEB] bg-[#2F7AEB] rounded-full text-center py-1 my-2 ">
                            <Link
                              className=" inline-block w-full h-full"
                              href={`/exam/${myExamData.testID}`}
                            >
                              เริ่มต้นสอบ
                            </Link>
                          </div>
                        )
                      ) : (
                        <div className=" w-full border-2 border-[#B5B6C2] rounded-full text-center py-1 my-2 ">
                          เริ่มต้นสอบ
                        </div>
                      )}
                      {myExamData?.examsUserData?.submittedTime ? (
                        <div className=" w-full border-2 text-white border-[#2F7AEB] bg-[#2F7AEB] rounded-full text-center py-1 my-2">
                          <Link
                            className=" inline-block w-full h-full"
                            href={`/score/${myExamData.testID}`}
                          >
                            คะแนนสอบ
                          </Link>
                        </div>
                      ) : (
                        <div className=" w-full border-2 border-[#B5B6C2] rounded-full text-center py-1 my-2">
                          คะแนนสอบ
                        </div>
                      )}
                      {myExamData?.examsUserData?.submittedTime ? (
                        solutions?.data?.data?.video_url ? (
                          <div className="w-full border-2 text-white border-[#2F7AEB] bg-[#2F7AEB] rounded-full text-center py-1 my-2">
                            <Link
                              className="inline-block w-full h-full"
                              href={`${solutions.data.data.video_url}`}
                            >
                              เฉลยข้อสอบ
                            </Link>
                          </div>
                        ) : (
                          <div className="w-full border-2 border-[#B5B6C2] rounded-full text-center py-1 my-2">
                            เฉลยข้อสอบ
                          </div>
                        )
                      ) : (
                        <div className="w-full border-2 border-[#B5B6C2] rounded-full text-center py-1 my-2">
                          เฉลยข้อสอบ
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex justify-center text-[#B5B6C2]">
                    <div className=" w-full">
                      <div className=" w-full border-2 border-[#B5B6C2] rounded-full text-center py-1 my-2 ">
                        เริ่มต้นสอบ
                      </div>
                      <div className=" w-full border-2 border-[#B5B6C2] rounded-full text-center py-1 my-2">
                        คะแนนสอบ
                      </div>
                      <div className=" w-full border-2 border-[#B5B6C2] rounded-full text-center py-1 my-2 ">
                        เฉลยข้อสอบ
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MyExamTimer startTime={myExamData.examData.startTime} />
    </main>
  )
}

export default MyExamPage
