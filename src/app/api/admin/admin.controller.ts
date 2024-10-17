import { collection, getDocs } from "firebase/firestore"
import { firestore } from "@/db/firebase"
import { getDocumentByEmail, validateEmail } from "@/utils/__init__"

interface Transaction {
  testID: string
  date: string
  fileURL: string
  status: string
  time: string
}

interface CategorizedData {
  [testID: string]: {
    email: string
    date: string
    fileURL: string
    status: string
    time: string
  }[]
}

export async function getPendingUsers(email: string) {
  try {
    // Validate email format
    if (!validateEmail(email)) {
      return { success: false, message: "Email is not formatted correctly" }
    }

    // Get the user document by email
    const userDoc = await getDocumentByEmail("users", email)

    // Check if the user document exists and if the user has admin permissions
    if (!userDoc?.exists()) return { success: false, status: 404, message: "Cannot find this user" }

    if (!userDoc.data().admin) return { success: false, status: 403, message: "Invalid permission" }

    // Fetch all documents from the 'transcription' collection
    const transcriptionRef = collection(firestore, "transactions")
    const querySnapshot = await getDocs(transcriptionRef)

    const categorizedData: CategorizedData = {}

    // Process each document to filter and categorize pending transactions
    querySnapshot.forEach((doc) => {
      const userEmail = doc.id // Assume document ID represents the user's email
      const userData = doc.data()

      if (Array.isArray(userData.transactions)) {
        userData.transactions.forEach((transaction: Transaction) => {
          const { testID, date, fileURL, status, time } = transaction

          // Filter only pending transactions
          if (status === "pending") {
            if (!categorizedData[testID]) {
              categorizedData[testID] = []
            }

            categorizedData[testID].push({
              email: userEmail,
              date: date,
              fileURL: fileURL,
              status: status,
              time: time,
            })
          }
        })
      }
    })

    return { success: true, data: categorizedData }
  } catch (e: unknown) {
    console.error("Error while getting pending users:", e)
    throw new Error("Error while getting user")
  }
}
