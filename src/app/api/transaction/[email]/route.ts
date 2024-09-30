import Elysia, { t } from "elysia"
import { StringField } from "@/utils/__init__"
import { updateStatus, userTransactions, Status } from "@/api/transaction/handler"
import { verifyEnvironmentKey } from "@/utils/validate"

const TransactionRoute = new Elysia({ prefix: "/api/transaction" })
  .guard({
    beforeHandle({ headers, error }) {
      const res = verifyEnvironmentKey({ headers })
      if (!res.success) {
        return error(401, `Error: ${res.message}`)
      }
    },
  })
  .get("/:email", async ({ params: { email }, error }) => {
    const res = await userTransactions(email)
    if (res.success) return res
    if (res.status === 404) return error(404, `Error: ${res.message}`)
    return error(400, `Error: ${res.message}`)
  }, {
    params: t.Object({
      email: StringField("Email must be provided"),
    }),
  })
  .patch(
    "/:email",
    async ({ params: { email }, body: { testID, status, environmentKey }, error }) => {
      const res = await updateStatus(email, testID, status, environmentKey)
      if (res.success) return res
      if (res.status === 404) return error(404, `Error: ${res.message}`)
      return error(400, `Error: ${res.message}`)
    },
    {
      params: t.Object({
        email: StringField("Email must be provided"),
      }),
      body: t.Object({
        testID: StringField("TestID must be provided"),
        status: t.Enum(Status, { error: "Status must be provided"}),
        environmentKey: StringField("Environment key must be provided"),
      }),
    }
  )

export const GET = TransactionRoute.handle
export const PATCH = TransactionRoute.handle
