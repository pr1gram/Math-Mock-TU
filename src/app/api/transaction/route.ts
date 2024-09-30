import Elysia, { t } from "elysia"
import { StringField } from "../../utils/__init__"
import { transaction } from "@/api/transaction/handler"
import { verifyEnvironmentKey } from "@/utils/validate"
import { error } from "console"

const TransactionRoute = new Elysia({ prefix: "/api/transaction" })
  .guard({
    beforeHandle({ headers, error }) {
      const res = verifyEnvironmentKey({ headers })
      if (!res.success) {
        return error(401, `Error: ${res.message}`)
      }
    },
  })
  .post("/", async ({ body }) => {
    const res = await transaction(body)
    if(res.success) return res
    return error(400, `Error: ${res.message}`)
  }, {
    body: t.Object({
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
      environmentKey: StringField("Environment key must be provided"),
    }),
  })

export const POST = TransactionRoute.handle
export const GET = TransactionRoute.handle
