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

interface Slip {
	email: string
	file: File
	date: string
	time: string
	price: string
	testID: string
}

enum Status {
	PENDING = 'pending',
	APPROVE = 'approved',
	REJECT = 'rejected',
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
		error('Transaction', ErrorFromType.POST)
		console.log(e)
		throw HTTPError.Internal('Error occurrred while retrieving user')
	}
}

export async function userTransactions(email: string) {
	try {
		if (!validateEmail(email)) {
			throw HTTPError.BadRequest('Email is not formatted correctly')
		}

		const usersRef = collection(firestore, 'transactions')
		const q = query(usersRef, where('email', '==', email))

		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			throw HTTPError.NotFound('Cannot find this user')
		}

		return querySnapshot.docs[0].data()
	} catch (e: unknown) {
		error('Transaction', ErrorFromType.GET)
		throw HTTPError.Internal('Error occured while fetching user')
	}
}
