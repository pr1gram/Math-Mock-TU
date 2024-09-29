import { storage, firestore } from "@/db/firebase"
import { doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import {
  getDocumentByEmail,
  validateEmail,
  getSnapshotByQuery,
} from "@/utils/__init__"

interface Slip {
  email: string
  file: File
  date?: string
  time?: string
  price?: string
  testID?: string
  status?: string
  environmentKey?: string
}

export enum Status {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

function dfsTransaction(transactions: Slip[], testID: string): number {
  function dfs(index: number): number {
    if (index >= transactions.length) return -1
    if (transactions[index].testID === testID) return index
    return dfs(index + 1)
  }
  return dfs(0)
}

async function uploadFile(email: string, testID: string, file: File): Promise<string> {
  const storageRef = ref(storage, `uploads/${email}/${testID}`)
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef)
}

async function updateTransaction(docRef: any, body: Slip, downloadURL: string) {
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

async function createTransaction(docRef: any, body: Slip, downloadURL: string) {
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

export async function transaction(body: Slip) {
  if (!validateEmail(body.email)) return { success: false, message: "Email is not formatted correctly" }

  const downloadURL = await uploadFile(body.email, body.testID!, body.file)

  if (!downloadURL) return { success: false, message: "Cannot get Image URL" }

  const docSnap = await getDocumentByEmail("transactions", body.email)

  if (docSnap?.exists()) {
    const transactionData: Slip[] = docSnap.data().transactions
    const isDuplicatedTransaction = transactionData.find(
      (transaction) => transaction.testID === body.testID
    )

    if (isDuplicatedTransaction) return { success: false, message: `Transaction with testID ${body.testID} already exists` }

    const { environmentKey, ...newBody } = body
    await updateTransaction(docSnap.ref, newBody, downloadURL)
    return { success: true, message: "Purchase completed" }
  } else {
    const docRef = doc(firestore, "transactions", body.email)
    const { environmentKey, ...newBody } = body
    await createTransaction(docRef, newBody, downloadURL)
    return { success: true, message: "Upload Transaction Completed" }
  }
}

export async function userTransactions(email: string) {
  if (!validateEmail(email)) return { success: false, message: "Email is not formatted correctly" }

  const querySnapshot = await getSnapshotByQuery("transactions", "email", email)
  if (querySnapshot.empty) return { success: false, status:404, message: "Cannot find user" }

  return querySnapshot.docs[0].data()
}

export async function getTransaction(email: string, testID: string) {
  const docSnap = await getDocumentByEmail("transactions", email)

  if (docSnap?.exists()) {
    const transactions: Slip[] = docSnap.data().transactions
    const transaction = transactions.find((t) => t.testID === testID)

    if (!transaction) return { success: false, status:404, message: `Cannot find ${testID} from ${email}` }

    return { ...transaction, email: email }
  }

  throw new Error("Cannot find user")
}

export async function updateStatus(
  email: string,
  testID: string,
  status: Status,
  environmentKey: string
) {
  try {

    if (!validateEmail(email)) return { success: false, message: "Email is not formatted correctly" }
  
    const docSnap = await getDocumentByEmail("transactions", email)
  
    if (docSnap?.exists()) {
      const transactions: Slip[] = docSnap.data().transactions
      const transactionIndex = dfsTransaction(transactions, testID)
      if (transactionIndex === -1) return { success: false, status:404, message: `Cannot find ${testID} from ${email}` }
  
      transactions[transactionIndex].status = status
      await updateDoc(docSnap.ref, { transactions })
  
      return { success: true, message: "Updated Successfully" }
    } else {
      return { success: false, status:404, message: "Cannot find user" }
    }
  } catch (e: unknown) {
    throw new Error("Error while updating status")
  } 
}
