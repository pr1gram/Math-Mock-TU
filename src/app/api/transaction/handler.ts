import { Errors } from "elysia-fault"
import { storage, firestore } from "@/db/firebase"
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import {
  getDocumentByEmail,
  validateEmail,
  validateEnvironmentKey,
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
    if (index >= transactions.length) return -1;
    if (transactions[index].testID === testID) return index;
    return dfs(index + 1);
  }
  return dfs(0);
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
  try {
    if (!validateEmail(body.email)) return new Errors.BadRequest("Email is not formatted correctly")

    if (!validateEnvironmentKey(body.environmentKey!))
      return new Errors.BadRequest("Environment key is invalid")

    const downloadURL = await uploadFile(body.email, body.testID!, body.file)
    if (!downloadURL) {
      return new Errors.BadRequest("Cannot get image URL")
    }

    const docSnap = await getDocumentByEmail("transactions", body.email)

    if (docSnap?.exists()) {
      const transactionData: Slip[] = docSnap.data().transactions
      const isDuplicatedTransaction = transactionData.find(
        (transaction) => transaction.testID === body.testID
      )

      if (isDuplicatedTransaction) {
        return new Errors.NotFound(`Transaction with testID ${body.testID} already exists`)
      }

      await updateTransaction(docSnap.ref, body, downloadURL)
      return { success: true, message: "Purchase completed" }
    } else {
      const docRef = doc(firestore, "transactions", body.email)

      await createTransaction(docRef, body, downloadURL)
      return { success: true, message: "Upload Transaction Completed" }
    }
  } catch (e: unknown) {
    return new Errors.InternalServerError("Error occurred while processing transaction")
  }
}

export async function userTransactions(email: string) {
  try {
    if (!validateEmail(email)) return new Errors.NotFound("Email is not formatted correctly")

    const querySnapshot = await getSnapshotByQuery("transactions", "email", email)
    if (querySnapshot.empty) return new Errors.NotFound("Cannot find this user")

    return querySnapshot.docs[0].data()
  } catch (e: unknown) {
    throw new Errors.InternalServerError("Error occurred while fetching user transactions")
  }
}

export async function getTransaction(email: string, testID: string) {
  try {
    const docSnap = await getDocumentByEmail("transactions", email)

    if (docSnap?.exists()) {
      const transactions: Slip[] = docSnap.data().transactions
      const transaction = transactions.find((t) => t.testID === testID)

      if (!transaction) {
        throw new Errors.NotFound(`Cannot find ${testID} from ${email}`)
      }

      return { ...transaction, email: email }
    }

    return new Errors.BadRequest("Cannot find user")
  } catch (e: unknown) {
    return new Errors.InternalServerError("Error occurred while fetching transaction")
  }
}

export async function updateStatus(
  email: string,
  testID: string,
  status: Status,
  environmentKey: string
) {
  try {
    if (!validateEmail(email)) return new Errors.BadRequest("Email is not formatted correctly")

    if (!validateEnvironmentKey(environmentKey!))
      return new Errors.BadRequest("Environment key is invalid")

    const docSnap = await getDocumentByEmail("transactions", email)

    if (docSnap?.exists()) {
      const transactions: Slip[] = docSnap.data().transactions
      const transactionIndex = dfsTransaction(transactions, testID)
      if (transactionIndex === -1) return new Errors.NotFound(`Cannot find ${testID} from ${email}`)

      transactions[transactionIndex].status = status
      await updateDoc(docSnap.ref, { transactions })

      return { success: true, message: "Updated Successfully" }
    } else {
      return new Errors.BadRequest("Cannot find user")
    }
  } catch (e: unknown) {
    return new Errors.InternalServerError("Error occurred while updating status")
  }
}
