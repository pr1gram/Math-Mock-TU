"use client"

import React, { useEffect, useState } from "react"

interface ExamChoiceProps {
  examName: string
  pointNumber: number // Change to number for easier calculations
  choices: string[]
}

const ExamChoice: React.FC<ExamChoiceProps> = ({ examName, pointNumber, choices }) => {
  const [storedValues, setStoredValues] = useState<number[]>([])

  useEffect(() => {
    // Get the data from local storage
    const data = localStorage.getItem(examName)

    // If data exists, parse it and update the state
    if (data) {
      setStoredValues(JSON.parse(data))
    } else {
      // If no data, initialize with zeros
      const initialValues = Array(choices.length).fill(0) // Adjust based on maximum number of questions
      setStoredValues(initialValues)
      localStorage.setItem(examName, JSON.stringify(initialValues)) // Save initial values in local storage
    }
  }, [examName, choices.length])

  const handleButtonClick = (index: number) => {
    // Create a copy of the current stored values
    const newValues = [...storedValues]

    // Store the index of the selected choice for the corresponding pointNumber
    newValues[pointNumber - 1] = index + 1 // Store index + 1 for 1-based choice

    // Update the state and local storage
    setStoredValues(newValues)
    localStorage.setItem(examName, JSON.stringify(newValues))

    console.log(`Updated selected choice for question ${pointNumber}: ${index + 1}`)
  }

  return (
    <div className=" sm:h-full sm:flex items-center sm:w-[300px] md:w-[340px] lg:w-[400px]">
      <div className=" w-full">
        <div className="text-[#383c4e] text-4xl font-bold mt-5 sm:mt-0 w-full">
          ข้อที่ {pointNumber}
        </div>
        <div className="space-y-2">
          {choices.map((choice, index) => (
            <button
              key={index}
              className={`border-2 block rounded-full px-4 py-2 min-w-[100%] text-left ${
                storedValues[pointNumber - 1] === index + 1
                  ? "bg-[#2F7AEB] text-white"
                  : "border-gray-300"
              }`}
              onClick={() => handleButtonClick(index)}
            >
              {index + 1}. {choice}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExamChoice
