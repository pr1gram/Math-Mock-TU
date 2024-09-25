import { auth } from "@/api/auth"
import CheckSignIn from "@/components/auth/checkSignIn"
import SignInButton from "@/components/auth/signInButton"

export default async function Auth() {
  const session = await auth()

  return (
    <main>
      <CheckSignIn isSignedIn={true} path={"/account"} />
      <SignInButton />
    </main>
  )
}
