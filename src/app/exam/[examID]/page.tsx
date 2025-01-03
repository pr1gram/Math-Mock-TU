import { auth } from "@/api/auth"
import CheckSignIn from "@/components/auth/checkSignIn"
import ExamChoice from "@/components/exam/examChoice"
import StartExamButton from "@/components/exam/startExamButton"
import ExamQuestion from "@/components/exam/examQuestion"
import ExamCountCounter from "@/components/exam/examCountCounter"
import ExamCountSelect from "@/components/exam/examCountSelect"
import ExamTimer from "@/components/exam/examTimer"
import apiFunction from "@/components/api"
import Link from "next/link"
import ExamSummitButton from "@/components/exam/examSummit"
import { redirect } from "next/navigation"
import ExamDownloadButton from "@/components/exam/examDownloadButton"

const ExamPage = async ({
  params,
  searchParams,
}: {
  params: { examID: string } // The examID is passed as a route parameter
  searchParams: { n?: string } // The query parameter
}) => {
  const { examID } = params // Extracting the ExamID from the route
  const pointNumber = searchParams.n || "0" // Extracting the query parameter 'n' with a default value
  const pageNumber = parseInt(pointNumber)
  const session = await auth() // Authentication check
  const userData = await apiFunction("GET", `/authentication/${session?.user?.email}`, {})
  const checkSignIn = await CheckSignIn(false, "/auth") // Sign-in check
  const ExamApiData = await apiFunction("GET", `/exams/examlists/${examID}`, {}) // Fetching the count of the exam
  const startDateData = await apiFunction("GET", `/exams/${session?.user?.email}`, {})

  // Dynamically import the JSON file based on the examID
  let examData
  try {
    examData = await import(`@/data/exam/${decodeURIComponent(examID)}/data.json`) // Adjust the path as necessary
  } catch (error) {
    console.error("Failed to load exam data:", error)
    return <p>Error loading exam data.</p>
  }

  // Find the relevant exam data based on the pointNumber (question number)
  const examQuestion = examData.default.find(
    (exam: { question: string }) => exam.question === pointNumber
  )

  const examStartTime =
    startDateData?.data?.data?.examData?.[decodeURIComponent(examID)]?.startDate || 0
  const durationInMinutes = ExamApiData.data.data.duration
  const durationInMilliseconds = durationInMinutes * 60 * 1000

  const examEndTime = examStartTime + durationInMilliseconds

  if (startDateData?.data?.data?.examData?.[decodeURIComponent(examID)]?.submittedTime) {
    redirect(`/myExam/${examID}`)
  }

  return (
    <main>
      <div className="h-32"></div>
      {pointNumber !== "0" ? (
        <div>
          <div className=" flex justify-center">
            <div>
              <div className=" w-full py-2">
                <ExamTimer examName={decodeURIComponent(examID)} />
              </div>
              <div className=" flex justify-center w-full">
                <ExamCountCounter examName={decodeURIComponent(examID)} examNumber={pointNumber} />
              </div>
            </div>
          </div>
          <div className=" flex justify-center mt-3">
            <div className=" sm:flex sm:gap-2 md:gap-8 lg:gap-20">
              <ExamQuestion
                examName={decodeURIComponent(examID)}
                pointNumber={examQuestion?.question}
              />
              {examQuestion ? (
                <ExamChoice
                  examName={decodeURIComponent(examID)}
                  pointNumber={examQuestion.question}
                  choices={examQuestion.choices}
                />
              ) : (
                <p>Question not found</p>
              )}
              <div className=" flex justify-between mt-3 text-center">
                {pageNumber > 1 ? (
                  <Link href={`/exam/${examID}?n=${pageNumber - 1}`}>
                    <div className=" rounded-full px-4 py-[6px] w-24 text-white border-2 border-[#2F7AEB] bg-[#2F7AEB] sm:hidden ">
                      ย้อนกลับ
                    </div>
                  </Link>
                ) : (
                  <div className=" rounded-full px-4 py-[6px] w-24 text-[#B5B6C2] border-2 border-[#B5B6C2] sm:hidden ">
                    ย้อนกลับ
                  </div>
                )}
                {pageNumber !== ExamApiData.data.data.items ? (
                  <Link href={`/exam/${examID}?n=${pageNumber + 1}`}>
                    <div className=" rounded-full px-4 py-[6px] w-24 text-white border-2 border-[#2F7AEB] bg-[#2F7AEB] sm:hidden ">
                      ต่อไป
                    </div>
                  </Link>
                ) : (
                  <div className=" sm:hidden">
                    <ExamSummitButton examName={decodeURIComponent(examID)} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className=" mt-7 flex justify-center items-center gap-3 text-center">
            {pageNumber > 1 ? (
              <Link href={`/exam/${examID}?n=${pageNumber - 1}`}>
                <div className=" rounded-full px-4 py-[6px] w-24 text-white border-2 border-[#2F7AEB] bg-[#2F7AEB] max-sm:hidden mb-6 ">
                  ย้อนกลับ
                </div>
              </Link>
            ) : (
              <div className=" rounded-full px-4 py-[6px] w-24 text-[#B5B6C2] border-2 border-[#B5B6C2] max-sm:hidden mb-6 ">
                ย้อนกลับ
              </div>
            )}

            <ExamCountSelect examName={decodeURIComponent(examID)} pointNumber={pointNumber} />
            {pageNumber !== ExamApiData.data.data.items ? (
              <Link href={`/exam/${examID}?n=${pageNumber + 1}`}>
                <div className=" rounded-full px-4 py-[6px] w-24 text-white border-2 border-[#2F7AEB] bg-[#2F7AEB] max-sm:hidden mb-6 ">
                  ต่อไป
                </div>
              </Link>
            ) : (
              <div className=" max-sm:hidden">
                <ExamSummitButton examName={decodeURIComponent(examID)} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className=" flex justify-center">
          <div className=" block">
            <div className=" text-center text-4xl font-bold">คำชี้แจงก่อนสอบ</div>
            <div className=" text-md mx-4 my-4 border-2 border-black rounded-lg p-4">
              <ol>
                <li>ควรทำแบบทดสอบฉบับนี้บนคอมพิวเตอร์เพื่อความเสถียร และความไวในการเข้าระบบ</li>
                <li>นักเรียนมีเวลาทำข้อสอบฉบับนี้ 90 นาที</li>
                <li>
                  ระบบจะเริ่มจับเวลาหลังจากนักเรียนคลิกเริ่มทำข้อสอบ
                  ไม่สามารถยกเลิกหรือเริ่มจับเวลาใหม่ได้
                </li>
                <li>
                  หากเปลี่ยนอุปกรณ์ หรือปิดหน้าต่าง ระบบจะไม่บันทึกคำตอบและเวลาจะยังคงเดินต่อไป
                </li>
                <li>
                  หากเวลาหมด ระบบจะส่งข้อสอบโดปุ่มกดส่งคำตอบจะอยู่ที่ข้อ{" "}
                  {ExamApiData.data.data.items}{" "}
                  และเมื่อส่งคำตอบแล้วจะไม่สามารถกลับเข้ามาแก้ไขได้
                </li>
                <li>เมื่อครบ 90 นาที แล้วยังไม่กดส่งคำตอบระบบจะกดส่งคำตอบที่เลือกไว้อัตโนมัติ</li>
                <li>หากต้องการดาวน์โหลดข้อสอบสามารถดาวน์โหลดได้ที่ link ด้านล่าง (หมายเหตุ: ให้กดย้อนกลับหลังจากดาวน์โหลดเสร็จ)
                </li>
              </ol>
            </div>
            <div className=" flex justify-center">
              <ExamDownloadButton
                examName={decodeURIComponent(examID)}
                examID={ExamApiData.data.data._id}
                userData={userData.data}
                className="underline text-center text-sm mt-3 flex justify-center"
              />
            </div>
            <div className=" flex justify-center mt-3">
              <StartExamButton
                examName={decodeURIComponent(examID)}
                count={ExamApiData.data.data.items}
                session={session}
                examStartTime={examStartTime}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default ExamPage
