'use client';

import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { getSession } from "next-auth/react";

interface CheckSignInProps {
  isSignedIn: boolean;
  path: string;
}

export default function CheckSignIn({ isSignedIn, path }: CheckSignInProps) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession(); // Client-side session fetch
      if (isSignedIn && session) {
        router.push(path);
      } else if (!isSignedIn && !session) {
        router.push(path);
      }
    };

    checkSession();
  }, [isSignedIn, path, router]);

  return null; // Return null to prevent rendering anything
}
