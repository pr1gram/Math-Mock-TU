"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

interface CheckSignInProps {
  isSignedIn: boolean;
  path: string;
}

export default function CheckSignIn({ isSignedIn, path }: CheckSignInProps) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (isSignedIn) {
        if (session) {
          router.push(path);
        }
      }
      {
        if (!session) {
          router.push(path);
        }
      }
    };

    checkSession();
  }, [router, isSignedIn, path]);

  return null; // Return null to prevent rendering anything
}
