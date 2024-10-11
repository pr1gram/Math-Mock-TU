"use client"

import { signOut } from "next-auth/react"
import { redirect } from "next/dist/server/api-utils"

export default function SignOutButton() {
  return (
    <button
      onClick={async () => {
        await signOut({ callbackUrl: "/auth" })
      }}
      className=" border-2 border-white rounded-full text-white px-2 py-1"
    >
      ออกจากระบบ
    </button>
  )
}
