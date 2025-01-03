"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface ExamCountSelectProps {
  examName: string
  pointNumber: string
}

const ExamCountSelect: React.FC<ExamCountSelectProps> = ({ examName, pointNumber }) => {
  const [storedValues, setStoredValues] = useState<number[]>([])
  const [isExpanded, setIsExpanded] = useState(false) // Toggle to show all or limited points
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
    Router.push(`/exam/${examName}?n=${index + 1}`)
  }

  // Calculate the visible range based on the current pageNumber
  const calculateVisibleRange = () => {
    const total = storedValues.length
    const visibleCount = 5 // Always show 5 points
    let start = Math.max(0, pageNumber - Math.ceil(visibleCount / 2)) // Start point based on the middle
    let end = start + visibleCount

    // If end exceeds the total, adjust both start and end
    if (end > total) {
      end = total
      start = Math.max(0, end - visibleCount)
    }

    return [start, end]
  }

  // Determine the range based on whether we're expanded or not
  const [start, end] = isExpanded ? [0, storedValues.length] : calculateVisibleRange()

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className=" flex items-center border-2 border-[#b5b6c2] rounded-3xl duration-300 my-4">
      <div className="duration-300">
        <div
          className={` gap-x-1 items-center justify-center   w-fit px-4 py-2
          ${
            isExpanded ? " grid-cols-5 grid sm:grid-cols-10" : "flex"
          } // Change number of columns based on expanded state
      `}
        >
          {storedValues.slice(start, end).map((value, index) => {
            const actualIndex = start + index // Adjust the index to the actual index in storedValues
            return (
              <div
                key={actualIndex}
                onClick={() => handlePointClick(actualIndex)}
                className={`cursor-pointer w-[40px] h-[40px] flex items-center justify-center rounded-full border-2 text-center
            ${
              pageNumber === actualIndex + 1
                ? "border-black text-black" // Black for current point
                : value !== 0
                ? "bg-blue-500 text-white" // Blue for non-zero values
                : "bg-white border-gray-300 text-gray-800" // White for zero values
            }`}
              >
                {actualIndex + 1}
              </div>
            )
          })}
        </div>

        {/* Add the toggle button */}
        <div
          className={` py-2 flex justify-center rounded-full text-center cursor-pointer
            ${isExpanded ? "row-start-10 col-span-full" : "flex justify-center"}`}
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <svg
              width="19"
              height="8"
              viewBox="0 0 19 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.0018 6.21606L9.58977 1.40918L1.17773 6.21606"
                stroke="#B5B6C2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="8"
              viewBox="0 0 20 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.76455 1.81226L10.1766 6.61914L18.5886 1.81226"
                stroke="#B5B6C2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExamCountSelect
