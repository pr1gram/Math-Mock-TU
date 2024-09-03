'use client'

import { signOut } from 'next-auth/react'
import { redirect } from 'next/dist/server/api-utils'

export default function SignOutButton() {
	return (
		<button
			onClick={async () => {
				await signOut({ callbackUrl: '/auth' })
			}}
		>
			Sign Out
		</button>
	)
}
