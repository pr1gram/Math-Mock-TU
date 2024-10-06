import { Elysia, t, error} from "elysia"
import { StringField, GlobalGuard } from "@/utils/__init__"
import { updateStatus, userTransactions } from "@/api/transaction/handler"
import { Status } from "../__init__"

const TransactionRouteEmail = new Elysia({ prefix: "/api/transaction" })
  .use(GlobalGuard)
  .get(
    "/:email",
    async ({ params: { email } }) => {
      const res = await userTransactions(email)
      if (res.success) return res
      else if (res.status === 404) return error(404, `Error: ${res.message}`)
      else return error(400, `Error: ${res.message}`)
    },
    {
      params: t.Object({
        email: StringField("Email must be provided"),
      }),
    }
  )
  .patch(
    "/:email",
    async ({ params: { email }, body: { testID, status } }) => {
      const res = await updateStatus(email, testID, status)
      if (res.success) return res
      else if (res.status === 404) return error(404, `Error: ${res.message}`)
      else return error(400, `Error: ${res.message}`)
    },
    {
      params: t.Object({
        email: StringField("Email must be provided"),
      }),
      body: t.Object({
        testID: StringField("TestID must be provided"),
        status: t.Enum(Status, { error: "Status must be provided" }),
      }),
    }
  )

export const GET = TransactionRouteEmail.handle
export const PATCH = TransactionRouteEmail.handle
