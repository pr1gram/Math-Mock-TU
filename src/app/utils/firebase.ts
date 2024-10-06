import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore"
import { firestore } from "@/db/firebase"

export async function _isUsernameExist(username: string | null) {
  const usersRef = collection(firestore, "users")
  const queryResult = query(usersRef, where("username", "==", username))
  const querySnapshot = await getDocs(queryResult)
  return !querySnapshot.empty
}

export async function _getDocumentByEmail(collectionName: string, email: string) {
  const q = query(collection(firestore, collectionName), where("email", "==", email))
  const querySnapshot = await getDocs(q)
  return !querySnapshot.empty ? querySnapshot.docs[0] : undefined
}

export async function _getSnapshotByQuery(collectionName: string, field: string, value: string) {
  const ref = collection(firestore, collectionName)
  const queryResult = query(ref, where(field, "==", value))
  return await getDocs(queryResult)
}

export async function _getDocumentById(collectionName: string, documentId: string) {
  const docRef = doc(firestore, collectionName, documentId)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap : undefined
}

export async function _updateSessionDoc(docId: string, userID: string, token: string) {
  const document = doc(firestore, "sessions", docId)
  await setDoc(
    document,
    {
      userID,
      token,
      createdAt: new Date(),
    },
    { merge: true }
  )
}

export async function _createSessionDoc(userID: string, token: string) {
  const sessionRef = collection(firestore, "sessions")
  const document = doc(sessionRef, userID)
  await setDoc(document, {
    userID,
    token,
    createdAt: new Date(),
  })
}
