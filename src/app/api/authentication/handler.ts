import { doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { firestore } from "@/db/firebase"
import {
  encoded,
  validateEmail,
  isUsernameExist,
  getDocumentByEmail,
  getSnapshotByQuery,
  createSessionDoc,
  updateSessionDoc,
} from "@/utils/__init__"
import { sign } from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import type { User } from "./__init__"

export async function createUser(options: User) {
  try {
    const user = await isUsernameExist(options.username || null)

    if (!options.username) return { success: false, message: "Username is required" }
    if (user) return { success: false, message: "Username already exists" }

    if (!validateEmail(options.email))
      return { success: false, message: "Email is not formatted correctly" }

    const userId = uuidv4()
    options._id = userId

    const ref = doc(firestore, "users", encoded(options.email))
    await setDoc(ref, options)

    return { success: true, message: `User ${options.username} created successfully` }
  } catch (e) {
    throw new Error("Error while creating user")
  }
}

export async function getUser(email: string) {
  try {
    if (!validateEmail(email))
      return { success: false, message: "Email is not formatted correctly" }

    const querySnapshot = await getDocumentByEmail("users", email)

    if (!querySnapshot?.exists()) return { success: false, message: "Cannot find this user" }

    return { success: true, data: querySnapshot.data() }
  } catch (e: unknown) {
    throw new Error("Error while getting user")
  }
}

export async function updateUser(email: string, options: Partial<User>) {
  try {
    if (!validateEmail(email))
      return { success: false, message: "Email is not formatted correctly" }

    const docSnap = await getDocumentByEmail("users", email)

    if (!docSnap?.exists()) return { success: false, message: "Cannot find this user" }

    const updateData: Partial<User> = {}

    Object.keys(options).forEach((key) => {
      const value = options[key as keyof User]
      if (value) updateData[key as keyof User] = value
    })

    await updateDoc(docSnap.ref, updateData)
    return { success: true, message: "User updated successfully" }
  } catch (e: unknown) {
    throw new Error("Error while updating user")
  }
}

export async function deleteUser(options: User) {
  try {
    if (!validateEmail(options.email))
      return { success: false, message: "Email is not formatted correctly" }

    const querySnapshot = await getDocumentByEmail("users", options.email)
    if (!querySnapshot?.exists()) return { success: false, message: "Cannot find this user" }

    await deleteDoc(querySnapshot.ref)
    return { success: true, message: "User deleted successfully" }
  } catch (e: unknown) {
    throw new Error("Error while deleting user")
  }
}

export async function generateJWT(email: string) {
  try {
    if (!validateEmail(email))
      return { success: false, message: "Email is not formatted correctly" }

    const querySnapshot = await getDocumentByEmail("users", email)

    if (!querySnapshot?.exists()) return { success: false, message: "Cannot find this user" }

    const userID = querySnapshot.data()._id
    let jwtToken: string

    const sessionSnapshot = await getSnapshotByQuery("session", "userID", userID)

    if (!sessionSnapshot.empty) {
      const sessionDoc = sessionSnapshot.docs[0]
      jwtToken = sign({ userID }, process.env.JWT_SECRET!)
      await updateSessionDoc(sessionDoc.id, userID, jwtToken)
    } else {
      jwtToken = sign({ userID }, process.env.JWT_SECRET!)
      await createSessionDoc(userID, jwtToken)
    }

    return { success: true, message: "JWT token generated successfully" }
  } catch (e: unknown) {
    throw new Error("Error while generating JWT token")
  }
}
