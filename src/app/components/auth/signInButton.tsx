"use client"

import { signIn } from "next-auth/react"
import Google_Logo from "@/vector/auth/google_logo"

export default function SignInButton() {
  return (
    <button
      className=" border border-[#b5b6c2] rounded-full sm:text-lg text-sm flex items-center py-2 sm:px-[52px] px-4 mt-3 gap-3 overflow-hidden whitespace-nowrap"
      onClick={async () => {
        await signIn("google", { callbackUrl: "/account" })
      }}
    >
      <Google_Logo />
      เข้าสู่ระบบด้วย Google
    </button>
  )
}
