import Elysia, { t } from "elysia"
import { StringField } from "@/utils/__init__"
import { updateStatus, userTransactions, Status } from "@/api/transaction/handler"
import { verifyEnvironmentKey } from "@/utils/validate"
import { CustomError } from "@/utils/errors"

const TransactionRoute = new Elysia({ prefix: "/api/transaction" })
  .guard({
    beforeHandle({ headers }: { headers: Record<string, string | undefined> }) {
      if (!verifyEnvironmentKey({ headers })) {
        throw new CustomError(401, "Unauthorized")
      }
    },
  })
  .get("/:email", async ({ params: { email } }) => await userTransactions(email), {
    params: t.Object({
      email: StringField("Email must be provided"),
    }),
  })
  .patch(
    "/:email",
    async ({ params: { email }, body: { testID, status, environmentKey } }) =>
      await updateStatus(email, testID, status, environmentKey),
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
