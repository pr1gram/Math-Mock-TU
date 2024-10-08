"use client"

import React, { useEffect, useState } from "react"

interface ExamQuestionProps {
  examName: string
}

const ExamCountCounter: React.FC<ExamQuestionProps> = ({ examName }) => {
  const [doneCount, setDoneCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const updateCounts = () => {
    // Retrieve the data from local storage
    const data = localStorage.getItem(examName)

    if (data) {
      // Parse the stored data to an array
      const valuesArray = JSON.parse(data)

      const totalCount: number = (valuesArray as number[]).length
      // Count the number of non-zero values
      const doneCount: number = (valuesArray as number[]).filter(
        (value: number) => value !== 0
      ).length

      setTotalCount(totalCount)
      setDoneCount(doneCount)
    } else {
      // Reset counts if no data found
      setTotalCount(0)
      setDoneCount(0)
    }
  }

  useEffect(() => {
    // Update counts when component mounts
    updateCounts()

    // Add event listener for storage changes
    window.addEventListener("storage", updateCounts)

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("storage", updateCounts)
    }
  }, [examName])

  return (
    <div
      className=" rounded-[20px] border-2 border-[#b5b6c2] text-[#383c4e] text-lg px-4 py-1 w-full text-center"
    >
      {doneCount} / {totalCount} ข้อ
    </div>
  )
}

export default ExamCountCounter
