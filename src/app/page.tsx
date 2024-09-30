import { signIn, signOut, auth } from "@/api/auth"
import Image from "next/image"

export default async function Home() {
  const session = await auth()

  return <main className="">
    <div className=" w-full h-screen">

    </div>
  </main>
}
