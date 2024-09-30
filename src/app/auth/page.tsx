import { auth } from "@/api/auth"
import CheckSignIn from "@/components/auth/checkSignIn"
import SignInButton from "@/components/auth/signInButton"
import Auth_Logo from "@/vector/auth/auth_logo"
import Google_Logo from "@/vector/auth/google_logo"
import Left_Arrow from "@/vector/left_arrow"
import Link from "next/link"

export default async function Auth() {
  const session = await auth()
  const check = await CheckSignIn(true, "/account")

  return (
    <main className=" bg-gradient-to-b from-[#0855CA] to-[#2F7AEB] w-full h-screen relative  z-0">
      <Auth_Logo className=" absolute right-0 bottom-0 max-md:w-[90%] md:h-[90%] -z-10 " />
      <div className=" w-full h-screen flex justify-center items-center">
        <div>
          <Link href="/" className=" inline-block">
            <div className=" flex text-white items-center gap-1 w-fit ">
              <Left_Arrow />
              <div>หน้าหลัก</div>
            </div>
          </Link>
          <div className=" bg-white  text-[#383c4e] sm:text-4xl text-3xl font-bold flex justify-center pt-5 pb-8 sm:px-8 px-4 rounded-xl mt-3 ">
            <div className=" text-center">
              <div>เข้าสู่ระบบ</div>
              <SignInButton />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
