"use client"
import ClockIcon from "@/vector/exam/clockIcon"
import React, { useEffect, useState } from "react"
import apiFunction from "@/components/api"
import { useSession } from "next-auth/react"
import { Session } from "inspector/promises"

interface ExamTimerProps {
  examName: string
  examEndTime: number // This should be in milliseconds
}

const ExamTimer: React.FC<ExamTimerProps> = ({ examName }) => {
  const [minutes, setMinutes] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)
  const [examEndTime, setExamEndTime] = useState<number>(0)
  const [timeRemaining, setTimeRemaining] = useState<number>(examEndTime - Date.now())
  const { data: session } = useSession()
  const fetchExamData = async () => {
    const ExamApiData = await apiFunction("GET", `/exams/examlists/${examName}`, {}) // Fetching the count of the exam
    const startDateData = await apiFunction("GET", `/exams/${session?.user?.email}`, {})
    const examStartTime = startDateData?.data?.data?.examData?.[examName]?.startDate || 0
    const durationInMinutes = ExamApiData.data.data.duration
    const durationInMilliseconds = durationInMinutes * 60 * 1000

    const examEndTime = examStartTime + durationInMilliseconds

    return setExamEndTime(examEndTime)
  }

  useEffect(() => {
    fetchExamData()
  }, [])

  useEffect(() => {
    // Function to update the timer
    const updateTimer = () => {
      const currentTime = Date.now()
      const newTimeRemaining = examEndTime - currentTime

      if (newTimeRemaining <= 0) {
        // If the time is up, clear the interval and set to zero
        clearInterval(interval)
        setTimeRemaining(0)
        setMinutes(0)
        setSeconds(0)
      } else {
        setTimeRemaining(newTimeRemaining)

        // Calculate total minutes and seconds
        const totalMinutes = Math.floor(newTimeRemaining / 1000 / 60) // Total minutes
        const secs = Math.floor((newTimeRemaining / 1000) % 60) // Remaining seconds

        // Update the state
        setMinutes(totalMinutes)
        setSeconds(secs)
      }
    }

    // Set the timer to update every second
    const interval = setInterval(updateTimer, 1000)

    // Clear interval on component unmount
    return () => clearInterval(interval)
  }, [examEndTime]) // Only re-run if examEndTime changes

  return (
    <div className="rounded-[20px] border-2 border-[#b5b6c2] text-[#383c4e] text-lg px-4 py-1 flex gap-2">
      <ClockIcon className="h-7" />
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  )
}

export default ExamTimer
