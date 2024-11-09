"use client"

import React, { useState } from "react"
import apiFunction from "@/components/api"
import { useRouter } from "next/navigation"

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
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const action = async (email: string, testID: string, status: string): Promise<void> => {
    try {
      await apiFunction("PATCH", `/transaction/${email}`, {
        testID: testID,
        status: status,
      })
      router.refresh()
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
      <div className="font-bold text-3xl ">
        {FirstName}
        <br />
        {LastName}
      </div>
      <div>
        <div className="font-bold flex ">
          การสอบ
          <div className="font-normal"> &nbsp;{testName}</div>
        </div>
        <div className="font-bold flex ">
          username
          <div className="font-normal">&nbsp;{username}</div>
        </div>
        <div className="font-bold flex ">
          โรงเรียน
          <div className="font-normal">&nbsp;{School}</div>
        </div>
        <div className="font-bold flex ">
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
      <div className=" flex">
        <button
          className="w-full rounded-full bg-[#2FBA5E] text-white py-1 m-1"
          onClick={() => {
            action(email, testName, "approved")
          }}
        >
          อนุมัติ
        </button>
        <button
          className="w-full rounded-full bg-[#FF0000] text-white py-1 m-1"
          onClick={() => {
            action(email, testName, "rejected")
          }}
        >
          ไม่อนุมัติ
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal} // Close when clicking outside
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
          >
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              &times;
            </button>
            {fileURL ? (
              <img src={fileURL} alt="Payment Evidence" className="max-w-full h-auto" />
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
  const data: { [key: string]: TestInfo[] } = JSON.parse(AdminResponseJSON)

  return (
    <div>
      <div className="space-y-6">
        {Object.keys(data).map((testName) =>
          data[testName].map((testInfo, index) => (
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
            />
          ))
        )}
      </div>
    </div>
  )
}

export default PendingLists
