import CheckSignIn from "@/components/auth/checkSignIn"
import SignOutButton from "@/components/auth/signOutButton"
import apiFunction from "@/components/api"
import { auth } from "@/api/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function Account() {
  const session = await auth()
  const response = await apiFunction("GET", `/authentication/${session?.user?.email}`, {})
  const adminResponse = await apiFunction("GET", `/admin/users/${session?.user?.email}`, {})
  await CheckSignIn(false, "/auth")
  if (response.status === 400) {
    redirect("/form")
  }

  return (
    <main className=" bg-gradient-to-t from-[#2F7AEB] to-[#0855CA] h-[calc(100dvh)] w-screen flex justify-center items-center ">
      <div>
        <div className=" bg-white border border-[#B5B6C2] rounded-xl p-4 min-w-[300px]">
          <div className=" text-[#383C4E] text-3xl font-bold">ข้อมูลส่วนตัว</div>
          <div className=" text-[#383C4E] text-xl font-bold">
            <div className=" flex gap-1">
              ชื่อ-นามสกุล
              <div className=" font-normal">
                {response.data.firstname} {response.data.lastname}
              </div>
            </div>
            <div className=" flex gap-1">
              username <div className="font-normal">{response.data.username}</div>
            </div>
            <div className=" flex gap-1">
              โรงเรียน <div className="font-normal">{response.data.school}</div>
            </div>
            <div className=" flex gap-1">
              เบอร์โทรศัพท์ <div className="font-normal">{response.data.tel}</div>
            </div>
          </div>
        </div>
        <div
          className={`flex mt-3 ${
            adminResponse.status == 200 ? "justify-between" : "justify-center"
          }`}
        >
          {adminResponse.status == 200 && (
            <Link href="/admin" className="border-2 border-white rounded-full text-white px-2 py-1">
              แผงควบคุม
            </Link>
          )}
          <SignOutButton />
        </div>
      </div>
    </main>
  )
}
