import { Errors } from 'elysia-fault'
import { storage, firestore } from '@/db/firebase'
import {
	collection,
	query,
	where,
	doc,
	getDocs,
	updateDoc,
	arrayUnion,
	setDoc,
	getDoc,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { validateEmail } from '@/utils/__init__'

interface Slip {
	email: string
	file: File
	date?: string
	time?: string
	price?: string
	testID?: string
	status?: string
}

enum Status {
	PENDING = 'pending',
	APPROVED = 'approved',
	REJECTED = 'rejected',
}

export async function transaction(body: Slip) {
	try {
		if (!validateEmail(body.email)) 
			return new Errors.BadRequest('Email is not formatted correctly')
		
		const storageRef = ref(storage, `uploads/${body.email}/${body.testID}`)
		await uploadBytes(storageRef, body.file)
		const downloadURL = await getDownloadURL(storageRef)

		const docRef = doc(firestore, 'transactions', body.email)
		const docSnap = await getDoc(docRef)

		if (docSnap.exists()) {
			if (!downloadURL) return new Errors.BadRequest('Cannot get image URL')

			const transactionData: Slip[] = docSnap.data().transactions
			const isDuplicatedTransaction = transactionData.find(
				(transaction) => transaction.testID === body.testID
			)

			if (isDuplicatedTransaction)
				return new Errors.NotFound(`Transaction with testID ${body.testID} already exists`)

			await updateDoc(docRef, {
				email: body.email,
				transactions: arrayUnion({
					testID: body.testID,
					date: body.date,
					time: body.time,
					price: body.price,
					fileURL: downloadURL,
					status: Status.PENDING,
				}),
			})
			return { success: true, message: 'Purchase completed' }
		} else {
			await setDoc(docRef, {
				email: body.email,
				transactions: [
					{
						testID: body.testID,
						date: body.date,
						time: body.time,
						price: body.price,
						fileUrl: downloadURL,
						status: Status.PENDING,
					},
				],
			})
		}

		return { success: true, message: 'Upload Transaction Completed' }
	} catch (e: unknown) {
		return new Errors.InternalServerError('Error occurrred while retrieving user')
	}
}

export async function userTransactions(email: string) {
	try {
		if (!validateEmail(email)) 
			return new Errors.NotFound('Email is not formatted correctly')
		
		const usersRef = collection(firestore, 'transactions')
		const q = query(usersRef, where('email', '==', email))

		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) 
			return new Errors.NotFound('Cannot find this user')
		
		return querySnapshot.docs[0].data()
	} catch (e: unknown) {
		throw new Errors.InternalServerError('Error occured while fetching user')
	}
}

export async function getTransaction(email: string, testID: string) {
	try {
		const docRef = doc(firestore, 'transactions', email)
		const docSnap = await getDoc(docRef)

		if (docSnap.exists()) {
			let transactions: Slip[] = docSnap.data().transactions
			const transactionIndex = transactions.findIndex(
				(transaction) => transaction.testID === testID
			)

			if (transactionIndex === -1)
				throw new Errors.NotFound(`Cannot find ${testID} from ${email}`)

			return { ...transactions[transactionIndex], email: email }
		} 
		
		return new Errors.BadRequest('Cannot find user')
		
	} catch (e: unknown) {
		return new Errors.InternalServerError('Error occured while fetching user')
	}
}

export async function updateStatus(email: string, testID: string) {
	try {
		const docRef = doc(firestore, 'transactions', email)
		const docSnap = await getDoc(docRef)

		if (docSnap.exists()) {
			let transactions: Slip[] = docSnap.data().transactions
			const transactionIndex = transactions.findIndex(
				(transaction) => transaction.testID === testID
			)

			if (transactionIndex === -1)
				return new Errors.NotFound(`Cannot find ${testID} from ${email}`)

			const updatedTransactions: Slip = {
				...transactions[transactionIndex],
				status: Status.APPROVED,
			}
			transactions[transactionIndex] = updatedTransactions

			await updateDoc(docRef, { transactions })
			return { success: true, message: 'Updated Successfully' }
		} else {
			return new Errors.BadRequest('Cannot find user')
		}
	} catch (e: unknown) {
		return new Errors.InternalServerError('Error occured while fetching user')
	}
}
