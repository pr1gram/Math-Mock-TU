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
import { ErrorFromType, validateEmail, error } from '@/utils/__init__'
import { HTTPError } from '@/utils/error'
import { InternalServerError, NotFoundError, ParseError, ValidationError } from 'elysia'

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
		if (!validateEmail(body.email)) {
			throw HTTPError.BadRequest('Email is not formatted correctly')
		}

		const storageRef = ref(storage, `uploads/${body.email}/${body.testID}`)
		await uploadBytes(storageRef, body.file)
		const downloadURL = await getDownloadURL(storageRef)

		const docRef = doc(firestore, 'transactions', body.email)
		const docSnap = await getDoc(docRef)

		if (docSnap.exists()) {
			if (!downloadURL) throw HTTPError.BadRequest('Cannot get image URL')

			const transactionData: Slip[] = docSnap.data().transactions
			const isDuplicatedTransaction = transactionData.find(
				(transaction) => transaction.testID === body.testID
			)

			if (isDuplicatedTransaction)
				throw new NotFoundError(`Transaction with testID ${body.testID} already exists`)

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
		throw new InternalServerError('Error occurrred while retrieving user')
	}
}

export async function userTransactions(email: string) {
	try {
		if (!validateEmail(email)) 
			throw new NotFoundError('Email is not formatted correctly')
		
		const usersRef = collection(firestore, 'transactions')
		const q = query(usersRef, where('email', '==', email))

		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			throw HTTPError.NotFound('Cannot find this user')
		}

		return querySnapshot.docs[0].data()
	} catch (e: unknown) {
		console.log(e)
		error('Transaction', ErrorFromType.GET)
		throw HTTPError.Internal('Error occured while fetching user')
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
				throw HTTPError.NotFound(`Cannot find ${testID} from ${email}`)

			const data = { ...transactions[transactionIndex], email: email }
			return data
		} else {
			throw HTTPError.BadRequest('Cannot find user')
		}
	} catch (e: unknown) {
		error('Transaction', ErrorFromType.PATCH)
		throw HTTPError.Internal('Error occured while fetching user')
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
				throw HTTPError.NotFound(`Cannot find ${testID} from ${email}`)

			const updatedTransactions: Slip = {
				...transactions[transactionIndex],
				status: Status.APPROVED,
			}
			transactions[transactionIndex] = updatedTransactions

			await updateDoc(docRef, { transactions })
			return 'Updated Successfully'
		} else {
			throw HTTPError.BadRequest('Cannot find user')
		}
	} catch (e: unknown) {
		console.log(e)
		error('Transaction', ErrorFromType.PATCH)
		throw HTTPError.Internal('Error occured while fetching user')
	}
}
