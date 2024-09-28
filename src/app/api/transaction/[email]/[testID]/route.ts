import Elysia, { t } from "elysia"
import { StringField } from "@/utils/__init__"
import { getTransaction } from "@/api/transaction/handler"
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
  .get(
  "/:email/:testID",
  async ({ params: { email, testID } }) => await getTransaction(email, testID),
  {
    params: t.Object({
      email: StringField("Email must be provided"),
      testID: StringField("TestID must be provided"),
    }),
  }
)

export const GET = TransactionRoute.handle
