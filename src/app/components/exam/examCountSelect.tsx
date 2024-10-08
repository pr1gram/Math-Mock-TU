"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface ExamCountSelectProps {
  examName: string
  pointNumber: string
}

const ExamCountSelect: React.FC<ExamCountSelectProps> = ({ examName, pointNumber }) => {
  const [storedValues, setStoredValues] = useState<number[]>([])
  const pageNumber = parseInt(pointNumber)
  const Router = useRouter()

  useEffect(() => {
    // Get the data from local storage
    const data = localStorage.getItem(examName)

    // If data exists, parse it and update the state
    if (data) {
      setStoredValues(JSON.parse(data))
    } else {
      // If no data, initialize with zeros
      const initialValues = Array(20).fill(0) // Assuming 20 points in total
      setStoredValues(initialValues)
      localStorage.setItem(examName, JSON.stringify(initialValues)) // Save initial values in local storage
    }
  }, [examName, pointNumber])

  const handlePointClick = (index: number) => {
    // Call the callback function to select the point number
    Router.push(`/exam/${examName}?n=${index + 1}`)
  }

  console.log(pageNumber)

  return (
    <div className=" flex justify-center">
      <div className="grid grid-cols-12 gap-x-1 items-center justify-center rounded-[18px] border-2 border-[#b5b6c2] w-fit px-4 py-2">
        {storedValues.map((value, index) => (
          <div
            key={index}
            onClick={() => handlePointClick(index)}
            className={`cursor-pointer w-[40px] h-[40px] flex items-center justify-center rounded-full border-2 text-center
          ${
            pageNumber === index + 1
              ? "border-black text-black" // Black for current point
              : value !== 0
              ? "bg-blue-500 text-white" // Blue for non-zero values
              : "bg-white border-gray-300 text-gray-800" // White for zero values
          }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExamCountSelect
