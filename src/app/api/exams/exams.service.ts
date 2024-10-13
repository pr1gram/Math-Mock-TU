import { firestore } from "@/db/firebase"
import { doc, setDoc, updateDoc } from "firebase/firestore"
import { error } from "elysia"
import { getDocumentById } from "@/utils/__init__"

export async function updateExamAnswers(email: string, testID: string, answers: string[]) {
  try {
    const userDocSnap = await getDocumentById("exams", email)
    const testData = userDocSnap?.data()[testID] || {}

    if (userDocSnap?.exists()) {
      const updatedData = {
        ...userDocSnap.data(),
        [testID]: {
          ...testData,
          answers: answers,
          submittedTime: Date.now(),
        },
      }

      const userDoc = doc(firestore, "exams", email)
      await updateDoc(userDoc, updatedData)
    } else {
      return error(400, { message: "User not found" })
    }
  } catch (e: unknown) {
    throw error(500, "Error while updating exam answers")
  }
}

export async function createExamDocument(email: string, testID: string, answers: string[]) {
  const newUserRef = doc(firestore, "exams", email)

  await setDoc(newUserRef, {
    [testID]: {
      answers: answers,
      submittedTime: Date.now(),
    },
  })
}
