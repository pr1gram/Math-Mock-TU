import { Elysia, t, error } from "elysia"
import { StringField, GlobalGuard} from "../../utils/__init__"
import { transaction } from "@/api/transaction/handler"

const TransactionRoute = new Elysia({ prefix: "/api/transaction" })
  .use(GlobalGuard)
  .post(
    "/",
    async ({ body }) => {
      const res = await transaction(body)
      if (res.success) return res
      if (res.status === 404) return error(404, `Error: ${res.message}`)
      else return error(400, `Error: ${res.message}`)
    },
    {
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
      }),
    }
  )

export const POST = TransactionRoute.handle
export const GET = TransactionRoute.handle
