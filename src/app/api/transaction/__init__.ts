import { storage } from "@/db/firebase"
import { updateDoc, arrayUnion, setDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export interface Slip {
  email: string
  file: File
  date?: string
  time?: string
  price?: string
  testID?: string
  status?: string
}

export enum Status {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export function dfsTransaction(transactions: Slip[], testID: string): number {
  function dfs(index: number): number {
    if (index >= transactions.length) return -1
    if (transactions[index].testID === testID) return index
    return dfs(index + 1)
  }
  return dfs(0)
}

export async function uploadFile(email: string, testID: string, file: File): Promise<string> {
  const storageRef = ref(storage, `uploads/${email}/${testID}`)
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef)
}

export async function updateTransaction(docRef: any, body: Slip, downloadURL: string) {
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
}

export async function createTransaction(docRef: any, body: Slip, downloadURL: string) {
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
