'use client'
import React from 'react'
import apiFunction from "@/components/api"

export const TestBtn = () => {
  const test = async () => {
    const res = await apiFunction("GET", "/authentication/test", {})
    window.alert(JSON.stringify(res))
  }
  return (
    <button onClick={test}>testBtn</button>
  )
}

export default TestBtn
