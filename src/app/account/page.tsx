import CheckSignIn from "@/components/auth/checkSignIn";
import SignOutButton from "@/components/auth/signOutButton";
import apiFunction from "@/components/api";
import { auth } from "@/api/auth";

export default async function Account() {

  const session = await auth();
  const response = await apiFunction("GET",`/api/authentication/chonlasitapilardmongkol@gmail.com`, {} );


  return (
    <main>
      <CheckSignIn isSignedIn={false} path={"/auth"} />
      <h1>Account</h1>
      <p>email : {response.email} </p>
      <SignOutButton />
    </main>
  );
}