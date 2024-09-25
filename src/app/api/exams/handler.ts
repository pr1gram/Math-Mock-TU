import { firestore } from "@/db/firebase"
import {
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore"
import { validateEmail, isUsernameExist, getDocumentByEmail } from "@/utils/__init__"
import { Errors } from "elysia-fault"

export async function sendExam(email: string, testID: string, answers: String[]) {
  try {
    if (!validateEmail(email)) return new Errors.NotFound("Email is not formatted correctly")

    const docSnap = await getDocumentByEmail("exams", email)

    if (docSnap.exists()) {
      const userDocRef = doc(firestore, "exams", email)
      await updateDoc(userDocRef, { [testID]: answers })

      return { success: true, message: "Test answers successfully added" }
    } else {
      const newUserRef = doc(firestore, "exams", email)

      await setDoc(newUserRef, {
        [testID]: answers,
      })

      return { success: true, message: "User created and test answers successfully added" }
    }
  } catch (e: unknown) {
    return new Errors.NotFound("Cannot find user")
  }
}
