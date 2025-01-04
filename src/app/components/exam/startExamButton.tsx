"use client"

import { useRouter } from "next/navigation"
import apiFunction from "@/components/api"
import { useState } from "react"
import MoonLoader from "react-spinners/MoonLoader"

interface StartExamButtonProps {
  examName: string
  count: number
  session: any
  examStartTime: number
}

const StartExamButton = ({ examName, count, session, examStartTime }: StartExamButtonProps) => {
  const router = useRouter()
  const [isExamStarted, setIsExamStarted] = useState(false)

  const handleOnClick = () => {
    setIsExamStarted(true)
    // Check if the item exists in localStorage
    if (!localStorage.getItem(examName)) {
      // If it doesn't exist, create it with initial values
      const initialValues = Array(count).fill(0)
      localStorage.setItem(examName, JSON.stringify(initialValues))
    }
    if (examStartTime === 0) {
      console.log("Sending start exam request")
      apiFunction("POST", `/exams/start`, {
        email: session?.user?.email,
        testID: examName,
      })
    }
    // Navigate to the exam page
    router.push(`/exam/${examName}?n=1`)
    router.refresh()
    
  }

  return (
    <button className={isExamStarted ?"bg-[#154081] text-white py-2 px-4 rounded-full flex" :"bg-[#2F7AEB] text-white py-2 px-4 rounded-full flex"} onClick={handleOnClick} disabled={isExamStarted}>
      {isExamStarted &&<MoonLoader color="white" size={15} />}
      เริ่มทำข้อสอบ
    </button>
  )
}

export default StartExamButton
