"use client"

import React, { useState } from "react"
import apiFunction from "@/components/api"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

interface TestInfo {
  email: string
  date: string
  status: string
  fileURL?: string
  userData: {
    firstname: string
    lastname: string
    school: string
    tel: string
    username: string
  }
}

interface TestCardProps {
  email: string
  userData: object
  username: string
  FirstName: string
  LastName: string
  School: string
  Tel: string
  fileURL?: string
  testName: string
  onActionComplete: (testName: string, email: string) => void
}

const TestCard: React.FC<TestCardProps> = ({
  email,
  userData,
  username,
  testName,
  FirstName,
  LastName,
  School,
  Tel,
  fileURL,
  onActionComplete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const action = async (email: string, testID: string, status: string , text:string): Promise<void> => {
    try {
      await apiFunction("PATCH", `/transaction/${email}`, {
        testID: testID,
        status: status,
      })
      onActionComplete(testName, email)
      Swal.fire({
        title: `${text}เรียบร้อย`,
        icon: "success",
      })
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }


  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="text-[#383C4E] bg-white rounded-xl p-6 min-w-[300px]">
      <div className="font-bold text-3xl">
        {FirstName}
        <br />
        {LastName}
      </div>
      <div>
        <div className="font-bold flex">
          การสอบ
          <div className="font-normal">&nbsp;{testName}</div>
        </div>
        <div className="font-bold flex">
          username
          <div className="font-normal">&nbsp;{username}</div>
        </div>
        <div className="font-bold flex">
          โรงเรียน
          <div className="font-normal">&nbsp;{School}</div>
        </div>
        <div className="font-bold flex">
          เบอร์โทรศัพท์
          <div className="font-normal">&nbsp;{Tel}</div>
        </div>
      </div>
      <div>
        <button
          className="w-full rounded-full border border-[#B5B6C2] py-1 m-1"
          onClick={openModal}
        >
          ดูหลักฐานการชำระเงิน
        </button>
      </div>
      <div className="flex">
        <button
          className="w-full rounded-full bg-[#2FBA5E] text-white py-1 m-1"
          onClick={() => {
            Swal.fire({
              title: "ยืนยันการอนุมัติ?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "ยืนยัน",
            }).then((result) => {
              if (result.isConfirmed) {
                action(email, testName, "approved","อนุมัติ")
              }
            })
          }}
        >
          อนุมัติ
        </button>
        <button
          className="w-full rounded-full bg-[#FF0000] text-white py-1 m-1"
          onClick={() => {
            Swal.fire({
              title: "ยืนยันการไม่อนุมัติ?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "ยืนยัน",
            }).then((result) => {
              if (result.isConfirmed) {
                action(email, testName, "rejected","ไม่อนุมัติ")
              }
            })
          }}
        >
          ไม่อนุมัติ
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              &times;
            </button>
            {fileURL ? (
              <img src={fileURL} alt="Payment Evidence" className=" w-full max-h-[70vh]" />
            ) : (
              <p>No payment evidence available</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface PendingListsProps {
  AdminResponseJSON: string
}

const PendingLists: React.FC<PendingListsProps> = ({ AdminResponseJSON }) => {
  const [data, setData] = useState<{ [key: string]: TestInfo[] }>(JSON.parse(AdminResponseJSON))
  const [searchQuery, setSearchQuery] = useState("")

  const handleActionComplete = (testName: string, email: string) => {
    setData((prevData) => {
      const updatedTests = prevData[testName].filter((test) => test.email !== email)
      if (updatedTests.length === 0) {
        const { [testName]: _, ...remainingData } = prevData
        return remainingData
      }
      return { ...prevData, [testName]: updatedTests }
    })
  }

  const filteredData = Object.keys(data).reduce((acc, testName) => {
    const filteredTests = data[testName].filter((testInfo) => {
      const firstname = testInfo.userData.firstname || "" 
      const lastname = testInfo.userData.lastname || ""
      const phone = testInfo.userData.tel || ""

      return (
        firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phone.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })

    if (filteredTests.length > 0) {
      acc[testName] = filteredTests
    }

    return acc
  }, {} as { [key: string]: TestInfo[] })

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="ค้นหาโดยชื่อ นามสกุล เบอร์โทรศัพท์"
          className="w-full p-2 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="space-y-6">
        {Object.keys(filteredData).length > 0 ? (
          Object.keys(filteredData).map((testName) =>
            filteredData[testName].map((testInfo, index) => (
              <TestCard
                key={index}
                email={testInfo.email}
                userData={testInfo.userData}
                username={testInfo.userData.username}
                testName={testName}
                FirstName={testInfo.userData.firstname}
                LastName={testInfo.userData.lastname}
                School={testInfo.userData.school}
                Tel={testInfo.userData.tel}
                fileURL={testInfo.fileURL}
                onActionComplete={handleActionComplete}
              />
            ))
          )
        ) : (
          <p className="text-center text-gray-500">ไม่พบข้อมูลที่ค้นหา</p>
        )}
      </div>
    </div>
  )
}


export default PendingLists
