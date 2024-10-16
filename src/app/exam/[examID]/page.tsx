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
  const checkSignIn = await CheckSignIn(false, "/auth") // Sign-in check
  const ExamApiData = await apiFunction("GET", `/exams/examlists/${examID}`, {}) // Fetching the count of the exam
  const startDateData = await apiFunction("GET", `/exams/${session?.user?.email}`, {})
  const transactionResponse = await apiFunction("GET", `/transaction/${session?.user?.email}/${examID}`, {})

  // Dynamically import the JSON file based on the examID
  let examData
  try {
    examData = await import(`@/data/exam/${examID}/data.json`) // Adjust the path as necessary
  } catch (error) {
    console.error("Failed to load exam data:", error)
    return <p>Error loading exam data.</p>
  }

  // Find the relevant exam data based on the pointNumber (question number)
  const examQuestion = examData.default.find(
    (exam: { question: string }) => exam.question === pointNumber
  )

  const examStartTime = startDateData?.data?.data?.examData?.[examID]?.startDate || 0
  const durationInMinutes = ExamApiData.data.data.duration
  const durationInMilliseconds = durationInMinutes * 60 * 1000

  const examEndTime = examStartTime + durationInMilliseconds
  console.log(examEndTime)

  if (transactionResponse?.data?.data?.examsUserData?.submittedTime) {
    redirect(`/myExam/${examID}`);
  }

  return (
    <main>
      <div className="h-32"></div>
      {pointNumber !== "0" ? (
        <div>
          <div className=" flex justify-center">
            <div>
              <div className=" w-full py-2">
                <ExamTimer examName={examID} />
              </div>
              <div className=" flex justify-center w-full">
                <ExamCountCounter examName={examID} />
              </div>
            </div>
          </div>
          <div className=" flex justify-center mt-3">
            <div className=" sm:flex sm:gap-2 md:gap-8 lg:gap-20">
              <ExamQuestion examName={examID} pointNumber={examQuestion?.question} />
              {examQuestion ? (
                <ExamChoice
                  examName={examID}
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
                    <ExamSummitButton examName={examID} />
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

            <ExamCountSelect examName={examID} pointNumber={pointNumber} />
            {pageNumber !== ExamApiData.data.data.items ? (
              <Link href={`/exam/${examID}?n=${pageNumber + 1}`}>
                <div className=" rounded-full px-4 py-[6px] w-24 text-white border-2 border-[#2F7AEB] bg-[#2F7AEB] max-sm:hidden mb-6 ">
                  ต่อไป
                </div>
              </Link>
            ) : (
              <div className=" max-sm:hidden">
                <ExamSummitButton examName={examID} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className=" flex justify-center">
          <StartExamButton
            examName={examID}
            count={ExamApiData.data.data.items}
            session={session}
            examStartTime={examStartTime}
          />
        </div>
      )}
    </main>
  )
}

export default ExamPage
