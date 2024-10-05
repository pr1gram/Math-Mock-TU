import Elysia, { t } from "elysia"
import { StringField } from "@/utils/__init__"
import { getTransaction } from "@/api/transaction/handler"
import { verifyEnvironmentKey } from "@/utils/validate"

const TransactionRouteTestID = new Elysia({ prefix: "/api/transaction" })
  .guard({
    beforeHandle({ error, request: { headers } }) {
      const res = verifyEnvironmentKey(headers)
      if (!res.success) return error(401, `Error: ${res.message}`)
    },
  })
  .get(
    "/:email/:testID",
    async ({ params: { email, testID }, error }) => {
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
