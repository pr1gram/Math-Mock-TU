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
import axios from "axios"
import { useRouter } from "next/navigation"

export default function ExamRegisterForm({ examData }: { examData: any }) {
  const [currentStep, setCurrentStep] = useState(1)
  const { data: session } = useSession()
  const generatePayload = require("promptpay-qr")
  const promptPayCode = generatePayload("0918054948", { amount: examData.price })
  const [responseError, setResponseError] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [selectList, setSelectList] = useState(false)
  const [examSelected, setExamSelected] = useState(true)
  const [testID, setTestID] = useState<string[]>([])

  const stepperTextStyle = (step: number) => {
    return currentStep === step ? "text-white mt-1" : "text-[#B5B6C2] mt-1"
  }

  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const router = useRouter()

  // Handle file selection through input or drop
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

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

  const handleTestIDSelect = (id: string) => {
    setTestID((prevTestID) => {
      let updatedTestID
      if (prevTestID.includes(id)) {
        // If already selected, remove the ID
        updatedTestID = prevTestID.filter((item) => item !== id)
      } else if (prevTestID.length < examData.packQuantity) {
        // If not selected and limit not reached, add the ID
        updatedTestID = [...prevTestID, id]
      } else {
        // If limit is reached, don't add more items
        updatedTestID = prevTestID
      }

      // Check if the selected count has reached packQuantity
      setExamSelected(updatedTestID.length === examData.packQuantity)
      return updatedTestID
    })
  }

  async function handleSummit() {
    setIsSending(true) // Set to true when the button is pressed

    try {
      const response = await RegisterationFormSubmit(file, session, examData) // Wait for API call to finish
      if (response.status === 400) {
        setResponseError(true)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSending(false) // Set to false after the API call completes (whether it succeeded or failed)
    }
  }

  const RegisterationFormSubmit = async (file: File | null, session: any, examData: any) => {
    const body = new FormData()
    if (file) {
      body.append("file", file)
    }
    body.append("email", session?.user?.email || "")
    body.append("testID", testID.join(","))
    body.append("price", examData.price || "")
    body.append("date", "")
    body.append("time", "")

    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/transaction`,
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
      data: body,
    }

    try {
      const response = await axios.request(options)
      if (response.status === 200) {
        router.push("/")
        router.refresh()
      }
      return response
    } catch (error: any) {
      console.error("Upload failed:", error)
      return error.response || error
    }
  }

  useEffect(() => {
    if (file) {
      const fileURL = URL.createObjectURL(file)
      setPreviewUrl(fileURL)
      return () => URL.revokeObjectURL(fileURL)
    }
  }, [file])

  useEffect(() => {
    if (examData.pack === false) {
      setTestID([examData.id])
    }
    if (examData.pack === true) {
      if (examData.packQuantity == examData.list.length) {
        setTestID(examData.list.map((item: any) => item))
      } else {
        setSelectList(true)
        setExamSelected(false)
      }
    }
  }, [examData])

  useEffect(() => {
    if (examSelected == false) {
      setCurrentStep(1)
    }
  }, [currentStep])

  const currentPage = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col justify-between min-h-[380px] sm:min-h-[450px] md:min-h-[540px]">
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
              {selectList && (
                <div>
                  <div className="text-[#383C4E] mt-2">เลือกวิชาที่ต้องการสอบ</div>
                  {examData.list.map((item: any) => (
                    <div key={item} className=" gap-3">
                      <label>
                        <input
                          type="checkbox"
                          value={item}
                          checked={testID.includes(item)}
                          onChange={() => handleTestIDSelect(item)}
                        />
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-center">
              {session ? (
                examSelected ? (
                  <button
                    className="bg-[#2F7AEB] border-[#2F7AEB] border-2 rounded-full text-white font-bold px-3 py-1"
                    onClick={() => setCurrentStep(2)}
                  >
                    สมัครสอบ
                  </button>
                ) : (
                  <button
                    className="bg-white border-[#B5B6C2] border-2 rounded-full text-[#B5B6C2] font-bold px-3 py-1"
                    disabled
                  >
                    สมัครสอบ
                  </button>
                )
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
                isSending ? (
                  <button
                    className="bg-[#1d4786] rounded-full text-white font-bold px-4 py-1"
                    onClick={handleSummit}
                  >
                    เสร็จสิ้น
                  </button>
                ) : (
                  <button
                    className="bg-[#2F7AEB] hover:bg-[#3774cf] rounded-full text-white font-bold px-4 py-1"
                    onClick={handleSummit}
                  >
                    เสร็จสิ้น
                  </button>
                )
              ) : (
                <button
                  className=" rounded-full text-[#B5B6C2] border-2 border-[#B5B6C2] font-bold px-4 py-1"
                  disabled
                >
                  เสร็จสิ้น
                </button>
              )}
            </div>
            {responseError && <div className=" flex justify-center text-red-500">สมัครสอบรายการนี้แล้ว</div>}
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
