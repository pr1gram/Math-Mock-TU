import Logo from "@/vector/logo"
import { auth } from "@/api/auth"
import Link from "next/link"
import apiFunction from "../api"
import UserIcon from "@/vector/userIcon"

export default async function NavBar() {
  const session = await auth()
  const response = await apiFunction("GET", `/authentication/${session?.user?.email}`, {})

  return (
    <div className="bg-[#0449B1]">
      <div className="container mx-auto flex justify-between items-center py-4">
        <Link href="/">
          <div className=" flex align-middle items-center gap-2 ">
            <Logo className=" h-12" />
            <h1 className="text-white text-4xl font-bold">ONE MATH</h1>
          </div>
        </Link>
        {session ? (
          <div className=" flex gap-5">
            <div className=" text-white px-4 py-2 rounded-full font-bold text-xl  border border-white ">
              {response?.data?.firstname} {response?.data?.lastname}
            </div>
            <Link href="/account">
              <UserIcon className="h-12" />
            </Link>
          </div>
        ) : (
          <div>
            <Link href="/auth">
              <button className="bg-white text-[#0449B1] px-4 py-2 rounded-full font-bold text-xl  border border-white hover:bg-transparent hover:text-white duration-500 ">
                เข้าสู่ระบบ
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
