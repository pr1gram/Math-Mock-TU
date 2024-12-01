import { Elysia, error, t } from "elysia"
import { cors } from '@elysiajs/cors'
import { GlobalGuard, StringField } from "@/utils/__init__"
import { getScore } from "../../../exams.controller"

const ResultsTestIDRoute = new Elysia({ prefix: "/api/exams/results" })
  .use(GlobalGuard)
  .use(cors())
  .get(
  "/:email/:testID",
  async ({ params: { email, testID } }) => {
    const res = await getScore(email, testID)
    if (res.success) return res
    else return error(404, res.message)
  },
  {
    params: t.Object({
      email: StringField("Email must be provided"),
      testID: StringField("Test ID must be provided correctly"),
    }),
  },
)

export const GET = ResultsTestIDRoute.handle
