import { firestore } from "@/db/firebase"
import { setDoc, updateDoc, doc, deleteDoc, collection, getDocs, getDoc } from "firebase/firestore"
import { validateEmail, getDocumentByEmail } from "@/utils/__init__"

interface ExamList {
  title: string,
  description?: string,
  date?: string,
  price?: number,
  duration?: number
}

async function updateExamAnswers(email: string, testID: string, answers: string[]) {
  const userDocRef = doc(firestore, "exams", email)
  await updateDoc(userDocRef, { [testID]: answers })
}

async function createExamDocument(email: string, testID: string, answers: string[]) {
  const newUserRef = doc(firestore, "exams", email)
  await setDoc(newUserRef, { [testID]: answers })
}

export async function examList(detail: ExamList) {
  try {
    const ref = doc(firestore, "examlists", detail.title)
    await setDoc(ref, detail)
    return { success: true, message: "Added to exam list successfully" }
  } catch (e) {
    throw new CustomError(500, "Error while adding exam list")
  }
}

export async function getExamList(title?: string) {
  try {
    if (!title) {
      const ref = collection(firestore, "examlists");
      const snapshot = await getDocs(ref);
      const examLists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      return { success: true, data: examLists }
    } else {
      const docSnap = await getDoc(doc(firestore, "examlists", title))

      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } }
      } else {
        throw new CustomError(404, "Exam list not found")
      }
    }
  } catch (e: unknown) {
    console.log(e)
    throw new CustomError(500, "Error while retrieving exam list")
  }
}
export async function updateExamList(title: string, detail: ExamList) {
  try {
    const ref = doc(firestore, "examlists", title)
    await setDoc(ref, detail, { merge: true })
    return { success: true, message: "Exam list updated successfully" }
  } catch (e) {
    throw new CustomError(500, "Error while updating exam list")
  }
}

export async function deleteExamList(title: string) {
  try {
    const ref = doc(firestore, "examLists", title)
    await deleteDoc(ref)
    return { success: true, message: `Delete ${title} sucessfully` }
  } catch (e) {
    throw new Error("Error while deleting exam list")
  }
}  

export async function sendExam(
  email: string,
  testID: string,
  answers: string[],
) {
  try {
    if (!validateEmail(email)) return { success: false, message: "Email is not formatted correctly" }

    const docSnap = await getDocumentByEmail("exams", email)
  
    if (!docSnap?.exists()) {
      await createExamDocument(email, testID, answers)
      return { success: true, message: "User created and test answers successfully added" }
    } else {
      await updateExamAnswers(email, testID, answers)
      return { success: true, message: "Test answers successfully added" }
    }
  } catch (e: unknown) {
    throw new Error("Error while sending exam")
  }
}
