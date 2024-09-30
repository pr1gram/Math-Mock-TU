import { Elysia, t } from "elysia"
import { StringField } from "@/utils/__init__"
import { sendExam } from "../handler"
import { verifyEnvironmentKey } from "@/utils/validate"

const ExamRoute = new Elysia({ prefix: "/api/exams" })
  .guard({
    beforeHandle({ headers, error }) {
      const res = verifyEnvironmentKey(headers)
      if (!res.success) {
        return error(401, `Error: ${res.message}`)
      }
    },
  })
  .post(
    "/:email",
    async ({ params: { email }, body: { testID, answers }, error }) => {
      const res = await sendExam(email, testID, answers)
      if (res.success) return res
      return error(400, `Error: ${res.message}`)
    },
    {
      params: t.Object({
        email: StringField("String must be provided"),
      }),
      body: t.Object({
        testID: StringField("String must be provided"),
        answers: t.Array(StringField("Answer must be provided correctly")),
        environmentKey: StringField("Environment Key must be provided"),
      }),
    }
  )

export const POST = ExamRoute.handle
