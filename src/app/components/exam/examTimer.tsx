"use client"
import ClockIcon from "@/vector/exam/clockIcon"
import React, { useEffect, useState } from "react"
import apiFunction from "@/components/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface ExamTimerProps {
  examName: string
}

const ExamTimer: React.FC<ExamTimerProps> = ({ examName }) => {
  const [minutes, setMinutes] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)
  const [examEndTime, setExamEndTime] = useState<number | null>(null)
  const { data: session } = useSession()
  const router = useRouter()

  const fetchExamData = async () => {
    if (!session?.user?.email) return

    try {
      const ExamApiData = await apiFunction("GET", `/exams/examlists/${examName}`, {})
      const startDateData = await apiFunction("GET", `/exams/${session.user.email}`, {})
      
      const examStartTime = startDateData?.data?.data?.examData?.[examName]?.startDate
      const durationInMinutes = ExamApiData.data.data.duration

      // --- CRITICAL FIX ---
      // If the other component hasn't uploaded the start time yet, 
      // examStartTime will be undefined. We must WAIT and TRY AGAIN.
      if (!examStartTime) {
        console.log("Start time not found yet. Retrying in 2 seconds...")
        setTimeout(fetchExamData, 2000) // Call this function again in 2 seconds
        return
      }

      // If we have a start time, proceed as normal
      const durationInMilliseconds = durationInMinutes * 60 * 1000
      const calculatedEndTime = examStartTime + durationInMilliseconds
      
      setExamEndTime(calculatedEndTime)
    } catch (error) {
      console.error("Error fetching exam data:", error)
      // Optional: Retry on error too, just in case of network blip
      setTimeout(fetchExamData, 3000) 
    }
  }

  useEffect(() => {
    if (session?.user?.email) {
      fetchExamData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examName, session]) 

  useEffect(() => {
    // 1. Don't run logic until we have a valid End Time
    if (examEndTime === null) return

    const updateTimer = () => {
      const currentTime = Date.now()
      const newTimeRemaining = examEndTime - currentTime

      if (newTimeRemaining <= 0) {
        clearInterval(interval)
        setMinutes(0)
        setSeconds(0)
        
        // 2. Only submit if we are SURE time has actually passed (safety check)
        if (examEndTime > 0) {
           summitExam() 
        }
      } else {
        setMinutes(Math.floor(newTimeRemaining / 1000 / 60))
        setSeconds(Math.floor((newTimeRemaining / 1000) % 60))
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [examEndTime])

  const summitExam = async () => {
    const data = JSON.parse(localStorage.getItem(examName) || "[]")
    const stringData = Array.isArray(data) ? data.map((item) => item.toString()) : []

    try {
      const response = await apiFunction("POST", `/exams/${session?.user?.email}`, {
        answers: stringData,
        testID: examName,
      })
      if (response.status === 200) {
        router.push(`/myExam/${examName}`)
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Show loading state while waiting for the other component
  if (examEndTime === null) {
     return (
        <div className="rounded-[20px] border-2 border-[#b5b6c2] text-[#383c4e] text-lg px-4 py-1 flex gap-2 animate-pulse">
        <ClockIcon className="h-7" />
        Syncing...
      </div>
     )
  }

  return (
    <div className="rounded-[20px] border-2 border-[#b5b6c2] text-[#383c4e] text-lg px-4 py-1 flex gap-2">
      <ClockIcon className="h-7" />
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  )
}

export default ExamTimer