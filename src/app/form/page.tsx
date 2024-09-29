import CheckSignIn from "@/components/auth/checkSignIn"
import apiFunction from "@/components/api"
import SignUpForm from "@/components/form/signupForm"
import SignOutButton from "@/components/auth/signOutButton"
import { auth } from "@/api/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Left_Arrow from "@/vector/left_arrow"

export default async function Account() {
  const session = await auth()
  const response = await apiFunction("GET", `/authentication/${session?.user?.email}`, {})
  const check = await CheckSignIn(false, "/auth")

  if (response.status === 200) {
    //console.log("Redirecting to /account")
    redirect("/account")
  }

  return (
    <main className=" bg-gradient-to-b from-[#0855CA] to-[#2F7AEB]">
      <div className=" w-full h-screen flex justify-center items-center">
        <div>
          <Link href="/" className=" inline-block">
            <div className=" flex text-white items-center gap-1">
              <Left_Arrow />
              <div>หน้าหลัก</div>
            </div>
          </Link>
          <div className=" bg-white  text-[#383c4e] sm:text-4xl text-3xl font-bold flex justify-center sm:pt-5 sm:pb-8 max-sm:py-3 sm:px-8 px-5 rounded-xl mt-3 w-64 sm:w-[408px] ">
            <div className=" w-full">
              <h1 className=" sm:text-4xl text-2xl font-bold text-left ">สร้างบัญชีใหม่</h1>
              <SignUpForm />
            </div>
          </div>
        </div>
        
      </div>
    </main>
  )
}
