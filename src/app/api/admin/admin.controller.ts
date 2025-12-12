import { collection, getDocs } from "firebase/firestore"
import { firestore } from "@/db/firebase"
import type { CategorizedData, Transaction, TransactionDocumentData } from "@/api/admin/admin.dto"
import { getDocumentByEmail, renameDocument, validateEmail } from "@/utils/__init__"

export async function getStatusUsers(email: string, state: string) {
  try {
    if (!validateEmail(email))
      return { success: false, message: "Email is not formatted correctly" }

    const adminDoc = await getDocumentByEmail("users", email)
    if (!adminDoc?.exists()) return { success: false, status: 404, message: "Cannot find this user" }
    if (!adminDoc.data().admin) return { success: false, status: 403, message: "Invalid permission" }

    // 1. Fetch all transaction documents (This part is fine for now)
    const transactionRef = collection(firestore, "transactions")
    const querySnapshot = await getDocs(transactionRef)

    const categorizedData: CategorizedData = {}
    
    // 2. Optimization: Identify which users we actually NEED to fetch
    // We only want users who actually have a transaction with the matching 'state'
    const validDocs: { id: string; data: any }[] = []
    const emailsToFetch = new Set<string>()

    for (const doc of querySnapshot.docs) {
      const userData = doc.data()
      // Check if this user has ANY transaction with the status we are looking for
      const hasMatchingStatus = userData.transactions?.some((t: Transaction) => t.status === state)
      
      if (hasMatchingStatus) {
        validDocs.push({ id: doc.id, data: userData })
        emailsToFetch.add(doc.id) // doc.id is the userEmail
      }
    }

    // 3. Parallel Execution: Fetch all required user profiles at once
    // This reduces 50+ round trips to just 1 round trip (conceptually)
    const userFetchPromises = Array.from(emailsToFetch).map(async (userEmail) => {
      const doc = await getDocumentByEmail("users", userEmail)
      return { email: userEmail, userData: doc?.exists() ? doc.data() : null }
    })

    const userProfiles = await Promise.all(userFetchPromises)

    // 4. Create a Map for instant lookup (O(1) access)
    const userMap: Record<string, any> = {}
    userProfiles.forEach((u) => {
      if (u.userData) userMap[u.email] = u.userData
    })

    // 5. Build the final response using the pre-fetched data
    for (const doc of validDocs) {
      const userEmail = doc.id
      const userData = doc.data
      const user = userMap[userEmail] // Instant lookup from memory

      userData.transactions.forEach((transaction: Transaction) => {
        const { testID, date, fileURL, status, time } = transaction

        if (status === state) {
          if (!categorizedData[testID]) {
            categorizedData[testID] = []
          }

          categorizedData[testID].push({
            email: userEmail,
            date: date,
            fileURL: fileURL,
            status: status,
            time: time,
            userData: user,
          })
        }
      })
    }

    return { success: true, data: categorizedData }
  } catch (e: unknown) {
    console.error("Error while getting pending users:", e)
    throw new Error("Error while getting user")
  }
}

export async function renameTransactionDocument(data: TransactionDocumentData) {
  const res = await renameDocument("transactions", data.oldName, data.newName);
  return { success: true, message: "Renamed successfully", status: 200 }
}