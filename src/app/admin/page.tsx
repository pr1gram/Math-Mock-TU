import { auth } from "@/api/auth"
import PendingLists from "@/components/admin/pendingLists"
import RejectLists from "@/components/admin/rejectLists"
import CheckSignIn from "@/components/auth/checkSignIn"

export default async function AdminPage() {
  const session = await auth()
  await CheckSignIn(false, "/auth")

  return (
    <main className=" bg-gradient-to-b from-[#0855CA] to-[#2F7AEB] w-full min-h-[calc(100dvh)] relative  z-0">
      <div className=" pt-[80px] w-full flex justify-center ">
        <div>
          <PendingLists />
          <hr  className=" my-8"/>
          <p className="text-white text-center text-2xl my-6">รายชื่อไม่ผ่านการตรวจสอบ</p>
          <hr  className=" my-8"/>
          <RejectLists />
        </div>
      </div>
    </main>
  )
}
