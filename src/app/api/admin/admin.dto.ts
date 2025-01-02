import { t } from "elysia"
import { StringField } from "@/utils/__init__"

export interface Transaction {
  testID: string
  date: string
  fileURL: string
  status: string
  time: string
}

export interface CategorizedData {
  [testID: string]: {
    email: string
    date: string
    fileURL: string
    status: string
    time: string
    userData?: any
  }[]
}

export interface TransactionDocumentData {
  oldName: string
  newName: string
}

export const TransactionDocumentValidator = t.Object({
  oldName: StringField("Old name must be provided"),
  newName: StringField("New name must be provided")
})
