import { firestore } from "@/db/firebase"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { error } from "elysia"
import { getDocumentById } from "@/utils/__init__"

export interface ExamList {
  _id?: string,
  title: string
  description?: string
  date?: string
  price?: number
  duration?: number
}

export async function updateExamAnswers(email: string, testID: string, answers: string[]) {
  try {
    const userDocSnap = await getDocumentById("exams", email)

    if (userDocSnap?.exists()) {
      const updatedData = {
        ...userDocSnap.data(),
        [testID]: answers,
      }

      const userDoc = doc(firestore, "exams", email)
      await updateDoc(userDoc, updatedData)
    } else {
      return error(400, { message: "User not found" })
    }
  } catch (e: unknown) {
      console.log(e)
    throw error(500, "Error while updating exam answers")
  }
}

export async function createExamDocument(email: string, testID: string, answers: string[]) {
  const newUserRef = doc(firestore, "exams", email)
  await setDoc(newUserRef, { [testID]: answers })
}
