import { Elysia, error, t } from "elysia"
import { cors } from '@elysiajs/cors'
import { GlobalGuard, StringField } from "@/utils/__init__"
import { solutions, getSolutions, updateSolutions, deleteSolutions } from "../../exams.controller"

const ResultsRoute = new Elysia({ prefix: "/api/exams/solutions" })
  .use(cors())
  .use(GlobalGuard)
  .get("/:testID",
  async ({ params: { testID } }) => {
    const res = await getSolutions(testID)
    if (res.success) return res
    else return error(404, res.message)
  },
  {
    params: t.Object({
      testID: StringField("Email must be provided"),
    }),
  },
)

export const GET = ResultsRoute.handle
