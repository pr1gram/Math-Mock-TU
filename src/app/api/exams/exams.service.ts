import { firestore } from "@/db/firebase"
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore"
import { error } from "elysia"
import { getDocumentById } from "@/utils/__init__"

export function sanitizeFieldName(fieldName: string): string {
  const s = fieldName.replace("[", "%");
  return s.replace("]", "%%")
}

export function reverse(fieldName: string): string {
  const s = fieldName.replace("%", "[")
  return s.replace("%%", "]")
}

export async function updateExamAnswers(email: string, testID: string, answers: string[]) {
  try {
    const docRef = doc(firestore, "exams", email)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      let data = docSnap.data()

      const sanitizedTestID = sanitizeFieldName(testID);
      data[sanitizedTestID] = {
        answers: answers,
        submittedTime: Date.now(),
      }

      console.log(data)
      await updateDoc(docRef, data)
    } else {
      throw new Error("User not found")
    }
  } catch (e: unknown) {
    console.log(e)
    throw new Error("Error while updating exam answers")
  }
}

export async function createExamDocument(email: string, testID: string, answers: string[]) {
  const newUserRef = doc(firestore, "exams", email)

  await setDoc(newUserRef, {
    [sanitizeFieldName(testID)]: {
      answers: answers,
      submittedTime: Date.now(),
    },
  })
}
