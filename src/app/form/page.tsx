import CheckSignIn from "@/components/auth/checkSignIn"
import apiFunction from "@/components/api"
import SignUpForm from "@/components/form/signupForm"
import SignOutButton from "@/components/auth/signOutButton"
import { auth } from "@/api/auth"
import { redirect } from "next/navigation"

export default async function Account() {
  const session = await auth()
  const response = await apiFunction("GET", `/authentication/${session?.user?.email}`, {})
  const check = await CheckSignIn(false, "/auth")

  console.log(response)

  if (response.status === 200) {
    console.log("Redirecting to /account")
    redirect("/account")
  }

  return (
    <main className=" bg-[#262626]">
      <div className=" w-full h-screen flex justify-center items-center">
        <div className=" block bg-white bg-opacity-20 border-white border-2 p-10 rounded-lg text-white">
          <h1 className="text-2xl font-bold text-center">Sign Up</h1>
          <SignUpForm  />
          <div className=" w-full flex justify-center mt-6">
            <SignOutButton />
          </div>
        </div>
      </div>
    </main>
  )
}
