"use client"

import apiFunction from "@/components/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Swal from 'sweetalert2'

interface ExamCountSelectProps {
  examName: string
}

const ExamSummitButton: React.FC<ExamCountSelectProps> = ({ examName }) => {
  const { data: session } = useSession()
  const Router = useRouter()

  const summitExam = async () => {
    const data = JSON.parse(localStorage.getItem(examName) || "[]")

    const stringData = Array.isArray(data) ? data.map((item) => item.toString()) : []
    try {
      const response = await apiFunction("POST", `/exams/${session?.user?.email}`, {
        answers: stringData,
        testID: examName,
      })
      if (response.status === 200) {
        Router.push(`/myExam/${examName}`)
        Router.refresh()
        setTimeout(() => Swal.close(), 2000)
      }
    } catch (error) {
      // Handle error
      console.error(error)
    }
  }

  return (
    <button
      type="submit"
      className="rounded-full px-4 py-[6px] text-white border-2 border-[#2F7AEB] bg-[#2F7AEB] mb-6"
      onClick={() => {
        Swal.fire({
          title: "ยืนยันการส่งข้อสอบ?",
          text: "หากส่งข้อสอบแล้วจะไม่สามารถแก้ไขได้อีก",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ยืนยัน"
        }).then((result) => {
          if (result.isConfirmed) {
            summitExam()
            Swal.fire({
              title: "ส่งข้อสอบเรียบร้อย",
              icon: "success"
            });
          }
        });
      }}
    >
      ส่งข้อสอบ
    </button>
  )
}

export default ExamSummitButton
