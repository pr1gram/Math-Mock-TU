import { error } from "elysia"
import { firestore } from "@/db/firebase"

import {
  setDoc,
  query,
  doc,
  deleteDoc,
  collection,
  getDocs,
  getDoc,
  where,
} from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"
import {
  validateEmail,
  getDocumentByEmail,
  getDocumentById,
  getSnapshotByQuery,
} from "@/utils/__init__"

import { createExamDocument, updateExamAnswers } from "./__init__"
import type { ExamList } from "./__init__"

export async function examList(detail: ExamList) {
  try {
    const ref = doc(firestore, "examLists", detail.title)

    const userId = uuidv4()
    detail._id = userId

    await setDoc(ref, detail)
    return { success: true, message: "Added to exam list successfully" }
  } catch (e) {
    throw error(500, "Error while adding exam list")
  }
}

export async function getUserExams(email: string) {
  try {
    const tranSnap = await getSnapshotByQuery("transactions", "email", email)
    if (tranSnap.empty) return { success: false, message: "Cannot find user exams", status: 404 }
    const testIDStatusMap: { [key: string]: string } = {}
    tranSnap.forEach((doc) => {
      const data = doc.data().transactions
      data.forEach((tran: any) => {
        testIDStatusMap[tran.testID] = tran.status
      })
    })
    return { success: true, data: testIDStatusMap }
  } catch (error) {
    throw new Error("Error while getting user exams")
  }
}

export async function getExamList(title?: string) {
  try {
    if (!title) {
      const ref = collection(firestore, "examLists")
      const snapshot = await getDocs(ref)

      const examLists = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      return { success: true, data: examLists }
    }

    const docSnap = await getDoc(doc(firestore, "examLists", title))

    if (docSnap.exists()) return { success: true, data: { id: docSnap.id, ...docSnap.data() } }

    return { success: false, message: "Exam list not found" }
  } catch (e: unknown) {
    throw error(500, "Error while getting exam list")
  }
}

export async function updateExamList(title: string, detail: ExamList) {
  try {
    const ref = doc(firestore, "examLists", title)
    if (!ref) return { success: false, message: "Exam list not found" }

    await setDoc(ref, detail, { merge: true })
    return { success: true, message: "Exam list updated successfully" }
  } catch (e) {
    throw error(500, "Error while updating exam list")
  }
}

export async function deleteExamList(title: string) {
  try {
    const ref = doc(firestore, "examLists", title)
    await deleteDoc(ref)
    return { success: true, message: `Delete ${title} sucessfully` }
  } catch (e: unknown) {
    throw error(500, "Error while deleting exam list")
  }
}

export async function startExam(email: string, testID: string) {
  try {
    if (!validateEmail(email))
      return { success: false, message: "Email is not formatted correctly" }

    const docSnap = await getDocumentById("exams", email)
    const examSnap = await getSnapshotByQuery("examLists", "title", testID)

    if (examSnap.empty) return { success: false, message: "Cannot find exam list" }

    const date = Date.now()

    if (!docSnap?.exists()) {
      const newUserRef = doc(firestore, "exams", email)
      await setDoc(newUserRef, {
        [testID]: {
          startDate: date,
        },
      })
      return { success: true, message: "Created successfully" }
    } else {
      const UserRef = doc(firestore, "exams", email)
      const userDoc = (await getDoc(UserRef)).data()

      await setDoc(UserRef, {
        ...userDoc,
        [testID]: {
          startDate: date,
        },
      })
      return { success: true, message: "Updated successfully" }
    }
  } catch (e: unknown) {
    throw error(500, "Error while starting exam")
  }
}

export async function sendExam(email: string, testID: string, answers: string[]) {
  try {
    if (!validateEmail(email))
      return { success: false, message: "Email is not formatted correctly" }

    const docSnap = await getDocumentById("exams", email)

    if (!docSnap?.exists()) {
      await createExamDocument(email, testID, answers)
      return { success: true, message: "User created and test answers successfully added" }
    } else {
      await updateExamAnswers(email, testID, answers)
      return { success: true, message: "Test answers successfully added" }
    }
  } catch (e: unknown) {
    throw error(500, "Error while sending exam")
  }
}

export async function solutions(testID: string, answers: String[]) {
  try {
    const ref = doc(firestore, "solutions", testID)
    await setDoc(ref, { testID: testID, answers: answers })
    return { success: true, message: "Added solutions successfully" }
  } catch (e: unknown) {
    throw error(500, "Error while adding solutions")
  }
}

export async function updateSolutions(testID: string, answers: String[]) {
  try {
    const ref = doc(firestore, "solutions", testID)
    await setDoc(ref, { answers: answers }, { merge: true })
    return { success: true, message: "Updated solutions successfully" }
  } catch (e: unknown) {
    throw error(500, "Error while updating solutions")
  }
}

export async function deleteSolutions(testID: string) {
  try {
    const ref = doc(firestore, "solutions", testID)
    await deleteDoc(ref)
    return { success: true, message: `Delete ${testID} solutions sucessfully` }
  } catch (e: unknown) {
    throw error(500, "Error while deleting solutions")
  }
}

export async function getScore(email: string, testID: string) {
  try {
    const docSnap = await getDocumentById("exams", email)

    if (docSnap?.exists()) {
      const data = docSnap.data()[testID]
      if (!data) return { success: false, message: "Cannot find answers" }

      const solutionSnap = await getDoc(doc(firestore, "solutions", testID))
      if (!solutionSnap.exists()) return { success: false, message: "Cannot find solutions" }

      const sols = solutionSnap.data().answers
      const score = data.answers.reduce(
        (acc: number, cur: string, idx: number) => (cur === sols[idx] ? acc + 1 : acc),
        0
      )

      return { success: true, data: { email: email, score: score } }
    }

    return { success: false, message: "Cannot find user" }
  } catch (e: unknown) {
    throw error(500, "Error while getting score")
  }
}
