import { t } from "elysia"
import { StringField } from "@/utils/__init__"

export interface ExamList {
  _id?: string
  title: string
  description?: string
  items?: number
  date?: string
  price?: number
  duration?: number
  startTime?: number
  endTime?: number
}

export const ExamListsValidator = t.Object({
  title: StringField("Title must be provided"),
  description: StringField("Description must be provided correctly"),
  items: t.Number({ message: "Item must be provided" }),
  date: StringField("Date must be provided"),
  price: t.Number({ message: "Price must be provided" }),
  duration: t.Number({ message: "Duration must be provided" }),
  startTime: t.Number({ message: "Start Time must be provided" }),
  endTime: t.Number({ message: "End Time must be provided" }),
})
