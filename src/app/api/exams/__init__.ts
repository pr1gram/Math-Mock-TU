import { firestore } from "@/db/firebase"
import { doc, setDoc, updateDoc } from "firebase/firestore"

export interface ExamList {
  title: string
  description?: string
  date?: string
  price?: number
  duration?: number
}

export async function updateExamAnswers(email: string, testID: string, answers: string[]) {
  const userDocRef = doc(firestore, "exams", email)
  await updateDoc(userDocRef, { [testID]: answers })
}

export async function createExamDocument(email: string, testID: string, answers: string[]) {
  const newUserRef = doc(firestore, "exams", email)
  await setDoc(newUserRef, { [testID]: answers })
}
