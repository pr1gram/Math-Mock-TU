"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import Left_Arrow from "@/vector/left_arrow"
import Stepper1Icon from "@/vector/exam/stepper1Icon"
import Stepper2Icon from "@/vector/exam/stepper2Icon"
import Stepper3Icon from "@/vector/exam/stepper3Icon"
import StepperLine from "@/vector/exam/stepperLine"
import CalendarIcon from "@/vector/exam/calendarIcon"
import ClockIcon from "@/vector/exam/clockIcon"
import WalletIcon from "@/vector/exam/walletIcon"
import QRCode from "react-qr-code"
import { RegisterationFormSubmit } from "./examRegisterForm.action"

export default function ExamRegisterForm({ examData }: { examData: any }) {
  const [currentStep, setCurrentStep] = useState(1)
  const { data: session } = useSession()
  const generatePayload = require("promptpay-qr")
  const promptPayCode = generatePayload("0918054948", { amount: examData.price })

  const stepperTextStyle = (step: number) => {
    return currentStep === step ? "text-white mt-1" : "text-[#B5B6C2] mt-1"
  }

  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Handle file selection through input or drop
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check file type
      if (!selectedFile.type.startsWith("image/")) {
        alert("Please select a valid image file (png, jpg, jpeg).")
        return
      }

      setFile(selectedFile)
    }
  }

  
  // Drag over event handler
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(true)
  }

  // Drag leave event handler
  const handleDragLeave = () => {
    setDragActive(false)
  }

  // Drop event handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]

    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (png, jpg, jpeg).")
      return
    }

    setFile(file) // This sets the file state if valid
    setPreviewUrl(URL.createObjectURL(file)) // Preview the image
  }

  // Function to handle file upload click
  const browseFiles = () => {
    document.getElementById("fileInput")?.click()
  }

  useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      setPreviewUrl(fileUrl)
      return () => URL.revokeObjectURL(fileUrl)
      
    }
  }, [file])

  const currentPage = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col justify-between h-[380px] sm:h-[450px] md:h-[540px]">
            <div>
              <div className="text-[#2f7aeb] text-3xl sm:text-4xl font-bold">{examData?.title}</div>
              <div className="my-3 text-[#383C4E]">
                <div className="flex gap-[2px] items-center">
                  <CalendarIcon className="w-5 sm:w-7 text-base sm:text-lg" />
                  {examData.date}
                </div>
                <div className="flex gap-[2px] items-center">
                  <ClockIcon className="w-5 sm:w-7 text-base sm:text-lg" />
                  {examData.duration} นาที
                </div>
                <div className="flex gap-[2px] items-center">
                  <WalletIcon className="w-5 sm:w-7 text-base sm:text-lg" />
                  {examData.price} บาท
                </div>
              </div>
              <div className="text-base">{examData.description}</div>
            </div>
            <div className="mt-4 flex justify-center">
              {session ? (
                <button
                  className="bg-[#2F7AEB] rounded-full text-white font-bold px-4 py-2"
                  onClick={() => setCurrentStep(2)}
                >
                  สมัครสอบ
                </button>
              ) : (
                <Link
                  href="/auth"
                  className="bg-[#2F7AEB] rounded-full text-white font-bold px-4 py-2"
                >
                  เข้าสู่ระบบ
                </Link>
              )}
            </div>
          </div>
        )
      case 2:
        return (
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-[#383c4e]">
                สแกน QR Code
                <br />
                เพื่อชำระเงิน
              </div>
              <div className="border border-[#b5b6c2] rounded-[9px] flex justify-center aspect-square items-center ">
                <QRCode value={promptPayCode} size={240} className="hidden md:block" />
                <QRCode value={promptPayCode} size={210} className="hidden sm:block md:hidden" />
                <QRCode value={promptPayCode} size={180} className="sm:hidden" />
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                className="bg-[#2F7AEB] rounded-full text-white font-bold px-5 py-2"
                onClick={() => setCurrentStep(3)}
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-[#383c4e]">
                อัปโหลดหลักฐาน
                <br />
                การชำระเงิน
              </div>
              <div
                className={`border-2 ${
                  dragActive ? "border-blue-500" : "border-dashed border-[#b5b6c2]"
                } rounded-[9px] flex justify-center items-center aspect-square`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={browseFiles}
              >
                {previewUrl ? (
                  <div className="flex justify-center items-center object-contain">
                    <img
                      src={previewUrl}
                      alt="Uploaded file preview"
                      className="object-contain rounded h-full w-full"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <div className=" flex justify-center">
                      <Stepper3Icon />
                    </div>
                    <p className="text-gray-500">ลากรูปมาที่นี่</p>
                    <p className="text-blue-500 cursor-pointer" onClick={browseFiles}>
                      หรือ ค้นดูไฟล์
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileSelect}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              {previewUrl ? (
                <button
                  className="bg-[#2F7AEB] rounded-full text-white font-bold px-5 py-2"
                  onClick={() => RegisterationFormSubmit(file, session, examData)}
                >
                  เสร็จสิ้น
                </button>
              ) : (
                <button
                  className=" rounded-full text-[#B5B6C2] border-2 border-[#B5B6C2] font-bold px-5 py-2"
                disabled
                >
                  เสร็จสิ้น
                </button>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <div className="flex gap-2 items-center text-white">
        <div className="flex gap-[2px] sm:gap-2 text-base sm:text-lg">
          <button onClick={() => setCurrentStep(1)}>
            <div className="block text-center">
              <div className="flex justify-center">
                <Stepper1Icon className="h-10 sm:h-[52px]" active={currentStep === 1} />
              </div>
              <div className={stepperTextStyle(1)}>สมัครสอบ</div>
            </div>
          </button>
          <div className="h-10 sm:h-[52px] items-center flex">
            <StepperLine />
          </div>
          <button onClick={() => setCurrentStep(2)}>
            <div className="block text-center">
              <div className="flex justify-center">
                <Stepper2Icon className="h-10 sm:h-[52px]" active={currentStep === 2} />
              </div>
              <div className={stepperTextStyle(2)}>ชำระเงิน</div>
            </div>
          </button>
          <div className="h-10 sm:h-[52px] items-center flex">
            <StepperLine />
          </div>
          <button onClick={() => setCurrentStep(3)}>
            <div className="block text-center">
              <div className="flex justify-center">
                <Stepper3Icon className="h-10 sm:h-[52px]" active={currentStep === 3} />
              </div>
              <div className={stepperTextStyle(3)}>หลักฐาน</div>
            </div>
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-[250px] sm:w-[290px] md:w-[320px]">
          <Link href="/" className="inline-block mt-4">
            <div className="flex text-white items-center gap-1 w-fit">
              <Left_Arrow />
              <div>หน้าหลัก</div>
            </div>
          </Link>
          <div className="bg-white rounded-[9px] border border-[#b5b6c2] p-4 flex flex-col mt-1 duration-500">
            {currentPage()}
          </div>
        </div>
      </div>
    </div>
  )
}
