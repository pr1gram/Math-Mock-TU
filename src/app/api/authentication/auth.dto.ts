import { t } from "elysia"
import { StringField } from "@/utils/__init__"

export interface User {
  _id?: string
  email: string
  firstname?: string
  lastname?: string
  username?: string
  school?: string
  tel?: string
}

export const AuthValidator = t.Object({
  email: StringField("String must be provided"),
  firstname: StringField("Firstname must be provided"),
  lastname: StringField("Lastname must be provided"),
  username: StringField("Username must be provided"),
  tel: StringField("Tel must be provided"),
  school: StringField("school must be provided"),
})
