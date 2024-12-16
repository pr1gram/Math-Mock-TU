import { Elysia, error, t } from "elysia"
import { cors } from '@elysiajs/cors'
import { GlobalGuard, StringField } from "@/utils/__init__"
import { getTransaction } from "../../transaction.controller"

const TransactionRouteTestID = new Elysia({ prefix: "/api/transaction" })
  .use(GlobalGuard)
  .use(cors({ 
    origin: ['https://math-mock-tu.vercel.app', 'https://www.pretest-tu.com'] 
  }))
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
  },
)

export const GET = TransactionRouteTestID.handle
