import { Elysia, error, t } from "elysia"
import { GlobalGuard, StringField } from "@/utils/__init__"
import { getUserExams, sendExam } from "@/api/exams/exams.controller"

const ExamRoute = new Elysia({ prefix: "/api/exams" })
  .use(GlobalGuard)
  .post(
    "/:email",
    async ({ params: { email }, body: { testID, answers } }) => {
      const res = await sendExam(email, testID, answers)
      if (res.success) return res
      else return error(400, `Error: ${res.message}`)
    },
    {
      params: t.Object({
        email: StringField("String must be provided"),
      }),
      body: t.Object({
        testID: StringField("String must be provided"),
        answers: t.Array(StringField("Answer must be provided correctly")),
      }),
    },
  )
  .get(
    "/:email",
    async ({ params: { email } }) => {
      const res = await getUserExams(email)
      if (res.success) return res
      if (res.status === 404) return error(404, `Error: ${res.message}`)
      return error(400, `Error: ${res.message}`)
    },
    {
      params: t.Object({
        email: StringField("String must be provided"),
      }),
    },
  )

export const POST = ExamRoute.handle
export const GET = ExamRoute.handle
