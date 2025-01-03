"use client"

import React, { useEffect, useState } from "react"

interface ExamQuestionProps {
  examName: string
}

const ExamCountCounter: React.FC<ExamQuestionProps> = ({ examName }) => {
  const [doneCount, setDoneCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const isLocalStorageAvailable = () => {
    try {
      const testKey = "__test__"
      localStorage.setItem(testKey, "test")
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  const updateCounts = () => {
    if (!isLocalStorageAvailable()) return
    const data = localStorage.getItem(examName)
    if (data) {
      try {
        const valuesArray = JSON.parse(data)
        const totalCount: number = (valuesArray as number[]).length
        const doneCount: number = (valuesArray as number[]).filter(
          (value: number) => value !== 0
        ).length
        setTotalCount(totalCount)
        setDoneCount(doneCount)
      } catch (error) {
        console.error("Failed to parse localStorage data:", error)
        setTotalCount(0)
        setDoneCount(0)
      }
    } else {
      setTotalCount(0)
      setDoneCount(0)
    }
  }

  useEffect(() => {
    if (!isLocalStorageAvailable()) return
    updateCounts()

    window.addEventListener("storage", updateCounts)

    const originalSetItem = localStorage.setItem
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, [key, value])
      if (key === examName) {
        updateCounts()
      }
    }

    return () => {
      window.removeEventListener("storage", updateCounts)
      localStorage.setItem = originalSetItem
    }
  }, [examName])

  return (
    <div className="rounded-[20px] border-2 border-[#b5b6c2] text-[#383c4e] text-lg px-4 py-1 w-full text-center">
      {doneCount} / {totalCount} ข้อ
    </div>
  )
}

export default ExamCountCounter
