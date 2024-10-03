import { useEffect } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/api/auth"

export default async function CheckSignIn(isSignedIn: boolean, path: string) {
  const session = await auth()
  if (isSignedIn && session) {
    redirect(path)
  } else if (!isSignedIn && !session) {
    redirect(path)
  }
  return null
}
