import { Elysia, t, error } from "elysia"
import { StringField } from "@/utils/__init__"
import { solutions, updateSolutions, deleteSolutions } from "../handler"
import { verifyEnvironmentKey } from "@/utils/validate"

const ResultsRoute = new Elysia({ prefix: "/api/exams/results" })
  .guard({
    beforeHandle({ error, request: { headers } }) {
      const res = verifyEnvironmentKey(headers)
      if (!res.success) return error(401, `Error: ${res.message}`   )
    },
  })
  .post(
    "/",
    async ({ body: { testID, answers }, error }) => {
      const res = await solutions(testID, answers)
      if (res.success) return res
      else return error(404, res.message)
    },
    {
      body: t.Object({
        testID: StringField("Title must be provided"),
        answers: t.Array(StringField("Answer must be provided correctly")),
      }),
    }
  )
  .patch(
    "/",
    async ({ body: { testID, answers }, error }) => {
      const res = await updateSolutions(testID, answers)
      if (res.success) return res
      else return error(404, res.message)
    },
    {
      body: t.Object({
        testID: StringField("Title must be provided"),
        answers: t.Array(StringField("Answer must be provided correctly")),
      }),
    }
  )
  .delete(
    "/",
    async ({ body: { testID }, error }) => {
      const res = await deleteSolutions(testID)
      if (res.success) return res
      else return error(404, res.message)
    },
    {
      body: t.Object({
        testID: StringField("Title must be provided"),
      }),
    }
  )

export const POST = ResultsRoute.handle
export const PATCH = ResultsRoute.handle
export const DELETE = ResultsRoute.handle
