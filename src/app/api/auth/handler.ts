import { firestore } from '@/db/firebase'
import { setDoc, collection, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'
import {
	error,
	ErrorFromType,
	validateEmail,
	isUsernameExist,
	getDocumentByEmail,
} from '@/utils/__init__'
import { HTTPError } from '@/utils/error'

interface User {
	email: string
	firstname?: string
	lastname?: string
	username?: string
	tel?: string
}

export async function createUser(options: User) {
	try {
		if (await isUsernameExist(options.username || '')) {
			throw HTTPError.Conflict('Username already exists')
		}

		if (!validateEmail(options.email)) {
			throw HTTPError.BadRequest('Email is not formatted correctly')
		}

		const docSnap = await getDocumentByEmail('users', options.email)

		if (docSnap.exists()) {
			await setDoc(docSnap.ref, options, { merge: true })
			return { success: true, message: `User ${options.username} has been updated` }
		}

		await setDoc(docSnap.ref, options)
		return { success: true, message: `User ${options.username} created successfully` }
	} catch (e: unknown) {
		error('Authentication', ErrorFromType.POST)
		throw HTTPError.BadRequest('Error while user creating auth')
	}
}

export async function getUser(email: string) {
	try {
		if (!validateEmail(email)) {
			throw HTTPError.BadRequest('Email is not formatted correctly')
		}

        console.log(email)
		const usersRef = collection(firestore, 'users')
		const q = query(usersRef, where('email', '==', email))
		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			throw HTTPError.NotFound('Cannot find this user')
		}

		return querySnapshot.docs[0].data()
	} catch (e: unknown) {
		error('Authentication', ErrorFromType.GET)
		throw HTTPError.Internal('Error occurrred while retrieving user')
	}
}

export async function updateUser(email: string, options: Partial<User>) {
	try {
		if (!validateEmail(email)) {
			throw HTTPError.NotFound('Email is not formatted correctly')
		}

		const docSnap = await getDocumentByEmail('users', email)

		if (!docSnap.exists()) {
			throw HTTPError.NotFound('Cannot find this user')
		}

		const updateData: Partial<User> = {}

		Object.keys(options).forEach((key) => {
			const value = options[key as keyof User]
			if (value) updateData[key as keyof User] = value
		})

		await updateDoc(docSnap.ref, updateData)
		return { success: true, message: 'User updated successfully' }
	} catch (e: unknown) {
		error('Authentication', ErrorFromType.PATCH)
		throw HTTPError.Internal('Error occurrred during user update')
	}
}

export async function deleteUser(options: User) {
	try {
		const usersRef = collection(firestore, 'users')
		const q = query(usersRef, where('email', '==', options.email))
		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			throw HTTPError.NotFound('Cannot find this user')
		}

		const userDoc = querySnapshot.docs[0]
		await deleteDoc(userDoc.ref)
		return { success: true, message: `User deleted successfully` }
	} catch (e: unknown) {
		error('Authentication', ErrorFromType.DELETE)
		throw HTTPError.Internal('Error while deleting user')
	}
}
