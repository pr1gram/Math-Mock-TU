"use client"
import React, { useState } from "react"
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

export default function ExamRegisterForm({ examData }: { examData: any }) {
  const [currentStep, setCurrentStep] = useState(1)
  const { data: session } = useSession()
  const generatePayload = require("promptpay-qr")
  const promptPayCode = generatePayload("0918054948", { amount: examData.price })

  const stepperTextStyle = (step: number) => {
    return currentStep === step ? "text-white mt-1" : "text-[#B5B6C2] mt-1"
  }

  console.log(examData)
  console.log(examData.title)

  const currentPage = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col justify-between  h-[380px] sm:h-[450px] md:h-[540px]">
            <div>
              <div className="text-[#2f7aeb] text-3xl sm:text-4xl font-bold">{examData?.title}</div>
              <div className=" my-3 text-[#383C4E]">
                <div className=" flex gap-[2px] items-center">
                  <CalendarIcon className=" w-5 sm:w-7 text-base sm:text-lg " />
                  {examData.date}
                </div>
                <div className=" flex gap-[2px] items-center">
                  <ClockIcon className=" w-5 sm:w-7 text-base sm:text-lg " />
                  {examData.duration} นาที
                </div>
                <div className=" flex gap-[2px] items-center">
                  <WalletIcon className=" w-5 sm:w-7 text-base sm:text-lg " />
                  {examData.price} บาท
                </div>
              </div>
              <div className=" text-base">{examData.description}</div>
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
          <div className=" flex flex-col justify-between h-full">
            <div>
              <div className=" text-3xl sm:text-4xl font-bold text-[#383c4e]">
                สแกน QR Code
                <br />
                เพื่อชำระเงิน
              </div>
              <div className="border border-[#b5b6c2] rounded-[9px] flex justify-center aspect-square items-center ">
                <QRCode value={promptPayCode} size={240} className=" hidden md:block" />
                <QRCode value={promptPayCode} size={210} className=" hidden sm:block md:hidden" />
                <QRCode value={promptPayCode} size={180} className=" sm:hidden" />
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
          <div className=" flex flex-col justify-between h-full">
            <div>
              <div className=" text-3xl sm:text-4xl font-bold text-[#383c4e]">
                อัปโหลดหลักฐาน
                <br />
                การชำระเงิน
              </div>
              <div className="border border-[#b5b6c2] rounded-[9px] flex justify-center aspect-square items-center "></div>
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
      default:
        return null
    }
  }

  return (
    <div>
      <div className="flex gap-2 items-center text-white">
        <div className=" flex gap-[2px] sm:gap-2 text-base sm:text-lg ">
          <button
            onClick={() => {
              setCurrentStep(1)
            }}
          >
            <div className=" block text-center">
              <div className=" flex justify-center">
                <Stepper1Icon className=" h-10 sm:h-[52px]" active={currentStep === 1} />
              </div>
              <div className={stepperTextStyle(1)}>สมัครสอบ</div>
            </div>
          </button>
          <div className=" h-10 sm:h-[52px] items-center flex">
            <StepperLine />
          </div>
          <button
            onClick={() => {
              setCurrentStep(2)
            }}
          >
            <div className=" block text-center">
              <div className=" flex justify-center">
                <Stepper2Icon className=" h-10 sm:h-[52px]" active={currentStep === 2} />
              </div>
              <div className={stepperTextStyle(2)}>ชำระเงิน</div>
            </div>
          </button>
          <div className=" h-10 sm:h-[52px] items-center flex">
            <StepperLine />
          </div>
          <button
            onClick={() => {
              setCurrentStep(3)
            }}
          >
            <div className=" block text-center">
              <div className=" flex justify-center">
                <Stepper3Icon className=" h-10 sm:h-[52px]" active={currentStep === 3} />
              </div>
              <div className={stepperTextStyle(3)}>หลักฐาน</div>
            </div>
          </button>
        </div>
      </div>
      <div className=" flex justify-center">
        <div className=" w-[250px] sm:w-[290px] md:w-[320px] ">
          <Link href="/" className=" inline-block mt-4">
            <div className=" flex text-white items-center gap-1 w-fit ">
              <Left_Arrow />
              <div>หน้าหลัก</div>
            </div>
          </Link>
          <div className=" bg-white rounded-[9px] border border-[#b5b6c2]  p-4 flex flex-col mt-1 duration-500">
            {currentPage()}
          </div>
        </div>
      </div>
    </div>
  )
}
