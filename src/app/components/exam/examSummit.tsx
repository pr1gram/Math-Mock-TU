"use client"

import apiFunction from "@/components/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface ExamCountSelectProps {
  examName: string
}

const ExamSummitButton: React.FC<ExamCountSelectProps> = ({ examName }) => {
  const { data: session } = useSession()
  const Router = useRouter()

  const summitExam = async () => {
    const data = JSON.parse(localStorage.getItem(examName) || "[]")

    const stringData = Array.isArray(data) ? data.map((item) => item.toString()) : []
    try {
      const response = await apiFunction("POST", `/exams/${session?.user?.email}`, {
        answers: stringData,
        testID: examName,
      })
      if (response.status === 200) {
        Router.push(`/myExam/${examName}`)
      }
    } catch (error) {
      // Handle error
      console.error(error)
    }
  }

  return (
    <button
      type="submit"
      className="bg-[#2F7AEB] text-white rounded-full px-4 py-2"
      onClick={summitExam}
    >
      ส่งข้อสอบ
    </button>
  )
}

export default ExamSummitButton
