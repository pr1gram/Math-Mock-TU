import { firestore } from "@/db/firebase"
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore"

export function sanitizeFieldName(fieldName: string): string {
  return fieldName.replace("[", "%").replace("]", "%%")
}

export function renameFields(examData: Record<string, any>) {
  const updatedExamData: Record<string, any> = {}

  for (const key in examData) {
    if (examData.hasOwnProperty(key)) {
      let newKey = key.replace("%", "[").replace("%%", "]")
      updatedExamData[newKey] = examData[key]
    }
  }

  return updatedExamData;
}
export async function updateExamAnswers(email: string, testID: string, answers: string[]) {
  try {
    const docRef = doc(firestore, "exams", email)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      let data = docSnap.data()
      console.log(data)

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
    email: email,
    [sanitizeFieldName(testID)]: {
      answers: answers,
      submittedTime: Date.now(),
    },
  })
}
