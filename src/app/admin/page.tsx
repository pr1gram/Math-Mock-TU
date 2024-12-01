import { auth } from "@/api/auth"
import apiFunction from "@/components/api"
import PendingLists from "@/components/admin/pendingLists"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await auth()
  const adminResponse = await apiFunction("GET", `/admin/users/${session?.user?.email}`, {})

  if (adminResponse.status === 403) {
    redirect("/")
  }

  const AdminResponseJSON = JSON.stringify(adminResponse.data.data)

  return (
    <main className=" bg-gradient-to-b from-[#0855CA] to-[#2F7AEB] w-full min-h-[calc(100dvh)] relative  z-0">
      <div className=" pt-[80px] w-full flex justify-center ">
        <div>
          <PendingLists AdminResponseJSON={AdminResponseJSON} />
        </div>
      </div>
    </main>
  )
}
