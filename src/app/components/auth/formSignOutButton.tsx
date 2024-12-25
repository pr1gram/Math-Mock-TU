"use client"
import { signOut } from "next-auth/react"

export default function FormSignOutButton() {
  return (
    <div className=" w-full flex justify-center">
      <button
        className="text-center text-sm mt-3 underline"
        onClick={async () => {
          await signOut({ callbackUrl: "/auth" })
        }}
      >
        ออกจากระบบ
      </button>
    </div>
  )
}
