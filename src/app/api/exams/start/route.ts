import { Elysia, error, t } from "elysia"
import { cors } from '@elysiajs/cors'
import { GlobalGuard, StringField } from "@/utils/__init__"
import { startExam } from "../exams.controller"

const ExamStartRoute = new Elysia({ prefix: "/api/exams" })
  .use(GlobalGuard)
  .use(cors())
  .post(
  "/start",
  async ({ body: { email, testID } }) => {
    const res = await startExam(email, testID)
    if (res.success) return res
    else return error(404, res.message)
  },
  {
    body: t.Object({
      email: StringField("Title must be provided"),
      testID: StringField("Answer must be provided correctly"),
    }),
  },
)

export const POST = ExamStartRoute.handle
