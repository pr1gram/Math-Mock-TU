import { firestore } from "@/db/firebase";
import { setDoc, updateDoc, doc } from "firebase/firestore";
import { validateEmail, getDocumentByEmail } from "@/utils/__init__";
import { Errors } from "elysia-fault";

async function updateExamAnswers(email: string, testID: string, answers: string[]) {
  const userDocRef = doc(firestore, "exams", email);
  await updateDoc(userDocRef, { [testID]: answers });
}

async function createExamDocument(email: string, testID: string, answers: string[]) {
  const newUserRef = doc(firestore, "exams", email);
  await setDoc(newUserRef, { [testID]: answers });
}

export async function sendExam(email: string, testID: string, answers: string[]) {
  try {
    if (!validateEmail(email)) 
      return new Errors.BadRequest("Email is not formatted correctly");

    const docSnap = await getDocumentByEmail("exams", email);

    if (!docSnap?.exists()) {
      await createExamDocument(email, testID, answers);
      return { success: true, message: "User created and test answers successfully added" };
    } else {
      await updateExamAnswers(email, testID, answers);
      return { success: true, message: "Test answers successfully added" };
    }
  } catch (e: unknown) {
    return new Errors.InternalServerError("Error while processing exam answers");
  }
}
