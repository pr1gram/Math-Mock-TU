import CheckSignIn from "@/components/auth/checkSignIn"
import SignOutButton from "@/components/auth/signOutButton"
import apiFunction from "@/components/api"
import { auth } from "@/api/auth"
import { redirect } from "next/navigation"

export default async function Account() {
  const session = await auth();
  const response = await apiFunction("GET", `/authentication/${session?.user?.email}`, {});
  const check = await CheckSignIn( false, "/auth" );

  console.log(response)

  if (response.status === 500) {
    console.log("Redirecting to /form");
    redirect("/form");
  }

  return (
    <main>
      <h1>Account</h1>
      <p>email : {response?.data.email} </p>
      <p>name : {response?.data.username}</p>
      <SignOutButton />
    </main>
  )
}
