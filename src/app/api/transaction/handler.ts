import { firestore } from "@/db/firebase"
import { doc, updateDoc } from "firebase/firestore"

import { getDocumentByEmail, validateEmail, getSnapshotByQuery } from "@/utils/__init__"
import {
  Status,
  createTransaction,
  dfsTransaction,
  updateTransaction,
  uploadFile,
} from "./__init__"
import type { Slip } from "./__init__"

export async function transaction(body: Slip) {
  if (!validateEmail(body.email))
    return { success: false, message: "Email is not formatted correctly" }

  const downloadURL = await uploadFile(body.email, body.testID!, body.file)

  if (!downloadURL) return { success: false, message: "Cannot get Image URL" }

  const docSnap = await getDocumentByEmail("transactions", body.email)

  if (docSnap?.exists()) {
    const transactionData: Slip[] = docSnap.data().transactions
    const isDuplicatedTransaction = transactionData.find(
      (transaction) => transaction.testID === body.testID
    )

    if (isDuplicatedTransaction)
      return { success: false, message: `Transaction with testID ${body.testID} already exists` }

    await updateTransaction(docSnap.ref, body, downloadURL)
    return { success: true, message: "Purchase completed" }
  } else {
    const docRef = doc(firestore, "transactions", body.email)
    await createTransaction(docRef, body, downloadURL)
    return { success: true, message: "Upload Transaction Completed" }
  }
}

export async function userTransactions(email: string) {
  if (!validateEmail(email)) return { success: false, message: "Email is not formatted correctly" }

  const querySnapshot = await getSnapshotByQuery("transactions", "email", email)
  if (querySnapshot.empty) return { success: false, status: 404, message: "Cannot find user" }

  return querySnapshot.docs[0].data()
}

export async function getTransaction(email: string, testID: string) {
  const docSnap = await getDocumentByEmail("transactions", email)

  if (docSnap?.exists()) {
    const transactions: Slip[] = docSnap.data().transactions
    const transaction = transactions.find((t) => t.testID === testID)

    if (!transaction)
      return { success: false, status: 404, message: `Cannot find ${testID} from ${email}` }

    return { ...transaction, email: email }
  }

  throw new Error("Cannot find user")
}

export async function updateStatus(email: string, testID: string, status: Status) {
  try {
    if (!validateEmail(email))
      return { success: false, message: "Email is not formatted correctly" }

    const docSnap = await getDocumentByEmail("transactions", email)

    if (docSnap?.exists()) {
      const transactions: Slip[] = docSnap.data().transactions
      const transactionIndex = dfsTransaction(transactions, testID)
      if (transactionIndex === -1)
        return { success: false, status: 404, message: `Cannot find ${testID} from ${email}` }

      transactions[transactionIndex].status = status
      await updateDoc(docSnap.ref, { transactions })

      return { success: true, message: "Updated Successfully" }
    } else {
      return { success: false, status: 404, message: "Cannot find user" }
    }
  } catch (e: unknown) {
    throw new Error("Error while updating status")
  }
}
