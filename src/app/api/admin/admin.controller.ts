import { collection, getDocs } from "firebase/firestore"
import { firestore } from "@/db/firebase"
import type { CategorizedData, Transaction } from "@/api/admin/admin.dto"
import { getDocumentByEmail, validateEmail } from "@/utils/__init__"

export async function getPendingUsers(email: string) {
  try {
    if (!validateEmail(email))
      return { success: false, message: "Email is not formatted correctly" }

    const userDoc = await getDocumentByEmail("users", email)

    if (!userDoc?.exists()) return { success: false, status: 404, message: "Cannot find this user" }
    if (!userDoc.data().admin) return { success: false, status: 403, message: "Invalid permission" }

    const transactionRef = collection(firestore, "transactions")
    const querySnapshot = await getDocs(transactionRef)

    const categorizedData: CategorizedData = {}

    for (const doc of querySnapshot.docs) {
      const userEmail = doc.id
      const userData = doc.data()
      const userDoc = await getDocumentByEmail("users", userEmail)
      const user = userDoc?.data()

      userData.transactions.forEach((transaction: Transaction) => {
        const { testID, date, fileURL, status, time } = transaction

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
