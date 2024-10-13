import { Elysia, error, t } from "elysia"
import { GlobalGuard, StringField } from "@/utils/__init__"
import { deleteSolutions, solutions, updateSolutions } from "../exams.controller"

const ResultsRoute = new Elysia({ prefix: "/api/exams/results" })
  .use(GlobalGuard)
  .post(
    "/",
    async ({ body: { testID, answers } }) => {
      const res = await solutions(testID, answers)
      if (res.success) return res
      else return error(404, res.message)
    },
    {
      body: t.Object({
        testID: StringField("Title must be provided"),
        answers: t.Array(StringField("Answer must be provided correctly")),
      }),
    },
  )
  .patch(
    "/",
    async ({ body: { testID, answers } }) => {
      const res = await updateSolutions(testID, answers)
      if (res.success) return res
      else return error(404, res.message)
    },
    {
      body: t.Object({
        testID: StringField("Title must be provided"),
        answers: t.Array(StringField("Answer must be provided correctly")),
      }),
    },
  )
  .delete(
    "/",
    async ({ body: { testID } }) => {
      const res = await deleteSolutions(testID)
      if (res.success) return res
      else return error(404, res.message)
    },
    {
      body: t.Object({
        testID: StringField("Title must be provided"),
      }),
    },
  )

export const POST = ResultsRoute.handle
export const PATCH = ResultsRoute.handle
export const DELETE = ResultsRoute.handle
