import { firestore } from "@/db/firebase"
import { doc, setDoc, collection, query, where, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore"
import { validateEmail, isUsernameExist, getDocumentByEmail, createSessionDoc, updateSessionDoc } from "@/utils/__init__"
import { Errors } from "elysia-fault"
import { sign } from "jsonwebtoken"
import { v4 as uuidv4 } from 'uuid';

interface User {
  email: string
  firstname?: string
  lastname?: string
  username?: string
  tel?: string
  _id?: string
}

export async function createUser(options: User) {
  try {
    if (await isUsernameExist(options.username || ""))
      return new Errors.BadRequest("Username already exists")

    if (!validateEmail(options.email))
      return new Errors.BadRequest("Email is not formatted correctly")

    const docSnap = await getDocumentByEmail("users", options.email)

    if (docSnap.exists()) {
      await setDoc(docSnap.ref, options, { merge: true })
      return { success: true, message: `User ${options.username} has been updated` }
    }

    const userId = uuidv4();
    options._id = userId
   
    await setDoc(docSnap.ref, options)
    return { success: true, message: `User ${options.username} created successfully` }
  } catch (e: unknown) {
    return new Errors.BadRequest("Error while user creating authentication")
  }
}

export async function getUser(email: string) {
  try {
    if (!validateEmail(email)) return new Errors.BadRequest("Email is not formatted correctly")

    const usersRef = collection(firestore, "users")
    const q = query(usersRef, where("email", "==", email))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) return new Errors.NotFound("Cannot find this user")

    return querySnapshot.docs[0].data()
  } catch (e: unknown) {
    return new Errors.NotFound("Cannot find user")
  }
}

export async function updateUser(email: string, options: Partial<User>) {
  try {
    if (!validateEmail(email)) return new Errors.NotFound("Email is not formatted correctly")

    const docSnap = await getDocumentByEmail("users", email)

    if (!docSnap.exists()) return new Errors.NotFound("Cannot find this user")

    const updateData: Partial<User> = {}

    Object.keys(options).forEach((key) => {
      const value = options[key as keyof User]
      if (value) updateData[key as keyof User] = value
    })

    await updateDoc(docSnap.ref, updateData)
    return { success: true, message: "User updated successfully" }
  } catch (e: unknown) {
    throw new Errors.InternalServerError("Error occurrred during user update")
  }
}

export async function deleteUser(options: User) {
  try {
    const usersRef = collection(firestore, "users")
    const q = query(usersRef, where("email", "==", options.email))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) return new Errors.NotFound("Cannot find this user")
    
    const userDoc = querySnapshot.docs[0]
    await deleteDoc(userDoc.ref)
  } catch (e: unknown) {
    return new Errors.InternalServerError("Error occured while deleting user")
  }
}

export async function generateJWT(email: string) {
  try {
    const querySnapshot = await getDocumentByEmail("users", email);

    if (!querySnapshot.exists()) return new Errors.NotFound("Cannot find this user");

    const userID = querySnapshot.data()._id;
    const sessionRef = collection(firestore, "sessions");
    const sessionQuery = query(sessionRef, where("userID", "==", userID));
    const sessionSnapshot = await getDocs(sessionQuery);

    const currentDate = new Date();
    let jwtToken: string;
    let expirationDate = new Date();
    expirationDate.setDate(currentDate.getDate() + 1);

    if (!sessionSnapshot.empty) {
      const sessionDoc = sessionSnapshot.docs[0];
      const sessionData = sessionDoc.data();
      const expiresAt = sessionData.expiresAt.toDate();

      if (expiresAt < currentDate) {
        jwtToken = sign({ userID }, process.env.JWT_SECRET!, { expiresIn: "1d" });
        await updateSessionDoc(sessionDoc.id, userID, jwtToken, expirationDate);
      } else {
        jwtToken = sessionData.token;
      }
    } else {
      jwtToken = sign({ userID }, process.env.JWT_SECRET!, { expiresIn: "1d" });
      await createSessionDoc(userID, jwtToken, expirationDate);
    }

    return { success: true, message: "JWT token generated successfully" };
  } catch (e: unknown) {
    return new Errors.InternalServerError("Error while generating JWT");
  }
}
