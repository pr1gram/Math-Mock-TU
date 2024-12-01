"use client"

import { useRouter } from "next/navigation"
import apiFunction from "@/components/api"

interface StartExamButtonProps {
  examName: string
  count: number
  session: any
  examStartTime: number
}

const StartExamButton = ({ examName, count, session, examStartTime }: StartExamButtonProps) => {
  const router = useRouter()

  const handleOnClick = () => {
    // Check if the item exists in localStorage
    if (!localStorage.getItem(examName)) {
      // If it doesn't exist, create it with initial values
      const initialValues = Array(count).fill(0)
      localStorage.setItem(examName, JSON.stringify(initialValues))
    }
    // Navigate to the exam page
    router.push(`/exam/${examName}?n=1`)
    router.refresh()
    if (examStartTime === 0) {
      apiFunction("POST", `/exams/start`, {
        email: session?.user?.email,
        testID: examName,
      })
    }
  }

  return (
    <button className="bg-[#2F7AEB] text-white py-2 px-4 rounded-full" onClick={handleOnClick}>
      เริ่มทำข้อสอบ
    </button>
  )
}

export default StartExamButton
