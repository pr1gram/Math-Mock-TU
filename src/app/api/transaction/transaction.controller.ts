import { firestore } from "@/db/firebase"

import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { error } from "elysia"
import {
  getDocumentByEmail,
  getDocumentById,
  getSnapshotByQuery,
  validateEmail,
} from "@/utils/__init__"

import {
  createTransaction,
  dfsTransaction,
  updateTransaction,
  uploadFile,
} from "./transaction.service"
import { type Slip, Status } from "./transaction.dto"

export async function transaction(body: Slip) {
  if (!validateEmail(body.email))
    return { success: false, message: "Email is not formatted correctly" };

  const testIDs = body.testID!.split(',').map(id => id.trim());

  for (let testID of testIDs) {
    const isTestExist = await getDocs(
      query(collection(firestore, "examLists"), where("title", "==", testID)),
    );

    if (isTestExist.empty)
      return {
        success: false,
        message: `Test with testID ${testID} does not exist`,
        status: 404,
      };

    const downloadURL = await uploadFile(body.email, testID, body.file);

    if (!downloadURL) return { success: false, message: "Cannot get Image URL" };

    const docSnap = await getDocumentByEmail("transactions", body.email);

    if (docSnap?.exists()) {
      const transactionData: Slip[] = docSnap.data().transactions;
      const isDuplicatedTransaction = transactionData.find(
        (transaction) => transaction.testID === testID,
      );

      if (isDuplicatedTransaction)
        return { success: false, message: `Transaction with testID ${testID} already exists` };

      let newBody = body; newBody.testID = testID
      await updateTransaction(docSnap.ref, newBody, downloadURL);
    } else {
      let newBody = body; newBody.testID = testID
      const docRef = doc(firestore, "transactions", body.email);
      await createTransaction(docRef, newBody, downloadURL);
    }
  }

  return { success: true, message: "All transactions completed successfully" };
}

export async function userTransactions(email: string) {
  if (!validateEmail(email)) {
    return { success: false, message: "Email is not formatted correctly" }
  }

  const querySnapshot = await getSnapshotByQuery("transactions", "email", email)
  if (querySnapshot.empty) return { success: false, status: 404, message: "Cannot find user" }

  const transactions = querySnapshot.docs[0].data().transactions
  let temp = []

  for (let i = 0; i < transactions.length; i++) {
    const examSnap = await getDocumentById("examLists", transactions[i].testID)
    if (examSnap?.exists()) temp.push({ ...transactions[i], examData: examSnap.data() })
  }

  return { success: true, data: temp }
}

export async function getTransaction(email: string, testID: string) {
  try {
    const docSnap = await getDocumentByEmail("transactions", email)
    const examUserSnap = await getDocumentById("exams", email)

    const test_id = decodeURIComponent(testID)
    const q = query(collection(firestore, "examLists"), where("title", "==", test_id))
    const querySnapshot = await getDocs(q)
    const examSnap = !querySnapshot.empty ? querySnapshot.docs[0] : undefined

    if (docSnap?.exists() && examSnap?.exists()) {
      const transactions: Slip[] = docSnap.data().transactions
      const transaction = transactions.find((t) => t.testID === test_id)

      if (!transaction)
        return { success: false, status: 404, message: `Cannot find ${test_id} from ${email}` }

      const examData = examSnap.data()

      if (examUserSnap?.exists()) {
        const examsUserData = examUserSnap.data()[testID]
        return {
          success: true,
          data: { ...transaction, examData, examsUserData },
        }
      } else {
        return {
          success: true,
          data: { ...transaction, examData },
        }
      }
    }
    return { success: false, status: 404, message: "Cannot find user or testID not found" }
  } catch (e: unknown) {
    throw error(500, "Error while getting transaction")
  }
}

export async function updateStatus(email: string, testID: string, status: Status) {
  try {
    if (!validateEmail(email))
      return { success: false, message: "Email is not formatted correctly" }

    const docSnap = await getDocumentByEmail("transactions", email)
    const userSnap = await getDocumentByEmail("users", email)

    if (docSnap?.exists()) {
      const transactions: Slip[] = docSnap.data().transactions
      const transactionIndex = dfsTransaction(transactions, testID)
      if (transactionIndex === -1)
        return {
          success: false,
          status: 404,
          message: `Cannot find testId: ${testID} from ${email}`,
        }

      if (!userSnap?.exists()) return { success: false, status: 404, message: "Cannot find user" }

      let userStatus = (transactions[transactionIndex].status = status)
      await updateDoc(docSnap.ref, { transactions })

      if (userStatus === Status.APPROVED) {
        await updateDoc(userSnap.ref, { tests: arrayUnion(testID) })
        return { success: true, message: "Updated Approved Successfully" }
      } else if (userStatus === Status.REJECTED)
        return { success: true, message: "Updated Rejected Successfully" }

      return { success: false, message: "Invalid status" }
    } else {
      return { success: false, status: 404, message: "Cannot find user" }
    }
  } catch (e: unknown) {
    throw new Error("Error while updating status")
  }
}
