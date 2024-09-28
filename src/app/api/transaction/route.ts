import Elysia, { t } from "elysia"
import { StringField } from "../../utils/__init__"
import { elysiaFault } from "elysia-fault"
import { transaction } from "@/api/transaction/handler"

const TransactionRoute = new Elysia({ prefix: "/api/transaction" })
  .use(elysiaFault())
  .post("/", async ({ body }) => await transaction(body), {
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
