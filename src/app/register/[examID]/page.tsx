import apiFunction from "@/components/api"
import { auth } from "@/api/auth"
import ExamRegisterForm from "@/components/exam/examRegisterForm"
import { redirect } from "next/navigation"

const ExamPage = async ({ params }: { params: { examID: string } }) => {
  const { examID } = params
  const session = await auth()

  const haveAccountresponse = await apiFunction("GET",`/authentication/${session?.user?.email}`,{})
  if (haveAccountresponse.status === 400) {
    redirect("/form")
  }

  const response = await apiFunction("GET", `/exams/examlists/${examID}`, {})
  if (response.status === 404) {
    redirect("/404")
  }
  const examData = response.data.data

  console.log(examData)

  return (
    <main>
      <div className=" w-full h-screen bg-gradient-to-b from-[#0855CA] to-[#2F7AEB] items-center flex justify-center">
        <ExamRegisterForm examData={examData} />
      </div>
    </main>
  )
}

export default ExamPage
