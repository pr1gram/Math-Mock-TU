import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { firestore } from '@/db/firebase'
import { encoded } from '@/utils/__init__'

export async function _isUsernameExist(username: string): Promise<boolean> {
	const usersRef = collection(firestore, 'users')
	const queryResult = query(usersRef, where('username', '==', username))
	const querySnapshot = await getDocs(queryResult)
	return !querySnapshot.empty
}

export async function _getDocumentByEmail(collection: string, email: string) {
	const ref = doc(firestore, collection, encoded(email))
	return await getDoc(ref)
}
