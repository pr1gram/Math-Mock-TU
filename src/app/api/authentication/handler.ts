import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { firestore } from "@/db/firebase"
import {
  validateEmail,
  validateEnvironmentKey,
  isUsernameExist,
  getDocumentByEmail,
  getSnapshotByQuery,
  createSessionDoc,
  updateSessionDoc
} from "@/utils/__init__"
import { Errors } from "elysia-fault"
import { sign } from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"

interface User {
  email: string
  firstname?: string
  lastname?: string
  username?: string
  tel?: string
  _id?: string
  environmentKey?: string
}

export async function createUser(options: User) {
  try {
    if (await isUsernameExist(options.username || ""))
      return new Errors.BadRequest("Username already exists")

    if (!validateEmail(options.email))
      return new Errors.BadRequest("Email is not formatted correctly")

    if (!validateEnvironmentKey(options.environmentKey!)) 
      return new Errors.BadRequest("Environment key is invalid")
    
    const docSnap = await getDocumentByEmail("users", options.email)

    if (docSnap?.exists()) {
      await setDoc(docSnap.ref, options, { merge: true })
      return { success: true, message: `User ${options.username} has been updated` }
    }

    const userId = uuidv4()
    options._id = userId

    const ref = doc(firestore, "users", encodeURIComponent(options.email))
    await setDoc(ref, options)

    return { success: true, message: `User ${options.username} created successfully` }
  } catch (e: unknown) {
    console.log(e)
    return new Errors.BadRequest("Error while creating user authentication")
  }
}

export async function getUser(email: string) {
  try {
    if (!validateEmail(email)) return new Errors.BadRequest("Email is not formatted correctly")
    
    const querySnapshot = await getDocumentByEmail("users", email)

    if (!querySnapshot?.exists()) return new Errors.NotFound("Cannot find this user")

    return querySnapshot.data()
  } catch (e: unknown) {
    return new Errors.NotFound("Cannot find user")
  }
}

export async function updateUser(email: string, options: Partial<User>) {
  try {
    if (!validateEmail(email))
      return new Errors.NotFound("Email is not formatted correctly")

    if (!validateEnvironmentKey(options.environmentKey!)) 
      return new Errors.BadRequest("Environment key is invalid")

    const docSnap = await getDocumentByEmail("users", email)

    if (!docSnap?.exists()) return new Errors.NotFound("Cannot find this user")

    const updateData: Partial<User> = {}

    Object.keys(options).forEach((key) => {
      const value = options[key as keyof User]
      if (value) updateData[key as keyof User] = value
    })

    await updateDoc(docSnap.ref, updateData)
    return { success: true, message: "User updated successfully" }
  } catch (e: unknown) {
    throw new Errors.InternalServerError("Error occurred during user update")
  }
}

export async function deleteUser(options: User) {
  try {
    if (!validateEmail(options.email))
      return new Errors.BadRequest("Email is not formatted correctly")

    if (!validateEnvironmentKey(options.environmentKey!)) 
      return new Errors.BadRequest("Environment key is invalid")

    const querySnapshot = await getDocumentByEmail("users", options.email)
    if (!querySnapshot?.exists()) return new Errors.NotFound("Cannot find this user")

    await deleteDoc(querySnapshot.ref)
    return { success: true, message: "User deleted successfully" }
  } catch (e: unknown) {
    return new Errors.InternalServerError("Error occurred while deleting user")
  }
}

export async function generateJWT(email: string, environmentKey: string) {
  try {
    if (!validateEmail(email))
      return new Errors.BadRequest("Email is not formatted correctly")
    
    if (!validateEnvironmentKey(environmentKey)) 
      return new Errors.BadRequest("Environment key is invalid")

    const querySnapshot = await getDocumentByEmail("users", email)

    if (!querySnapshot?.exists()) return new Errors.NotFound("Cannot find this user")

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
    return new Errors.InternalServerError("Error while generating JWT")
  }
}
