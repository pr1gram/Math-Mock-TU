import { t } from "elysia"
import { StringField } from "@/utils/__init__"

export interface Slip {
  email: string
  file: File
  date?: string
  time?: string
  price?: string
  testID?: string
  status?: string
}

export enum Status {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export const TransactionValidator = t.Object({
  email: t.String({
    error: StringField("User email must be provided"),
  }),
  file: t.File({
    error: "Image file must be provided",
  }),
  date: StringField("Date must be provided"),
  time: StringField("Time must be provided"),
  price: StringField("Price must be provided"),
  testID: StringField("Test ID must be provided"),
})
