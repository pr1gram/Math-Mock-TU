import { Elysia, t, error } from "elysia"
import { StringField, GlobalGuard } from "@/utils/__init__"
import { getTransaction } from "@/api/transaction/handler"

const TransactionRouteTestID = new Elysia({ prefix: "/api/transaction" })
  .use(GlobalGuard)
  .get(
    "/:email/:testID",
    async ({ params: { email, testID } }) => {
      const res = await getTransaction(email, testID)
      if (res.success) return res
      else if (res.status === 404) return error(404, `Error: ${res.message}`)
      else return error(400, `Error: ${res.message}`)
    },
    {
      params: t.Object({
        email: StringField("Email must be provided"),
        testID: StringField("TestID must be provided"),
      }),
    }
  )


export const GET = TransactionRouteTestID.handle
