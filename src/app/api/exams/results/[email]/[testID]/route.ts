import { Elysia, t, error } from "elysia"
import { StringField } from "@/utils/__init__"
import { getScore } from "../../../handler"
import { verifyEnvironmentKey } from "@/utils/validate"

const ResultsTestIDRoute = new Elysia({ prefix: "/api/exams/results" })
  .guard({
    beforeHandle({ error, request: { headers } }) {
      const res = verifyEnvironmentKey(headers)
      if (!res.success) return error(401, `Error: ${res.message}`   )
    },
  })
  .get(
    "/",
    async ({ params: { email, testID }, error }) => {
    const res = await getScore(email, testID)  
    if (res.success) return res
    else return error(404, res.message)
    },
    {
      params: t.Object({
        email: StringField("Email must be provided"),
        testID: StringField("Test ID must be provided correctly"),
      }),
    }
  )

export const GET = ResultsTestIDRoute.handle
