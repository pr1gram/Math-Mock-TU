import Logo from "@/vector/logo"
import { auth } from "@/api/auth"
import Link from "next/link"
import apiFunction from "../api"
import UserIcon from "@/vector/userIcon"

export default async function NavBar() {
  const session = await auth()
  if (session) {
    const response = await apiFunction("GET", `/authentication/${session?.user?.email}`, {})
    return (
        <div className="bg-[#0449B1] border-b-2 border-white h-16 z-[999] w-screen fixed">
          <div className="container mx-auto flex justify-between items-center h-full max-sm:px-4 ">
            <Link href="/">
              <div className=" flex align-middle items-center gap-2 ">
                <Logo className=" h-10" />
                <h1 className="text-white text-3xl font-bold">ONE MATH</h1>
              </div>
            </Link>
            <div className=" flex gap-5">
              <div className=" text-white px-4 py-2 rounded-full font-bold text-xl  border border-white sm:flex hidden ">
                {response?.data?.firstname} {response?.data?.lastname}
              </div>
              <Link href="/account" className=" flex items-center">
                <UserIcon className="h-10" />
              </Link>
            </div>
          </div>
        </div>
    )
  } else {
    return (
      <div className="bg-[#0449B1] border-b-2 border-white h-16 z-[999] w-screen fixed">
        <div className="container mx-auto flex justify-between items-center h-full max-sm:px-4 ">
          <Link href="/">
            <div className=" flex align-middle items-center gap-2 ">
              <Logo className=" h-10" />
              <h1 className="text-white text-3xl font-bold">ONE MATH</h1>
            </div>
          </Link>
          <div>
            <Link href="/auth">
              <button className=" text-white sm:px-4 px-2 sm:py-2 py-1 rounded-full font-bold sm:text-xl text-lg  border border-white bg-transparent  duration-500 ">
                เข้าสู่ระบบ
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
