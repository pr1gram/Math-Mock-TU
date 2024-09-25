import { auth } from "@/api/auth"
import CheckSignIn from "@/components/auth/checkSignIn"
import SignInButton from "@/components/auth/signInButton"

export default async function Auth() {
	const session = await auth()
	const check = await CheckSignIn( true, "/account" );

	return (
		<main>
			<SignInButton />
		</main>
	)
}
