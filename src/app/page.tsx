import { signIn, signOut, auth } from "@/api/auth";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <main>
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button type="submit">Sign in</button>
      </form>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Sign out</button>
        <div className=" block">
          {session?.user?.email}
          {session?.user?.name}
          <Image src={session?.user?.image ?? ""} alt="" width={200} height={200} />
        </div>
      </form>
    </main>
  );
}
