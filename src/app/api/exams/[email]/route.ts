import { Elysia, t } from "elysia"
import { StringField } from "@/utils/__init__"
import { sendExam } from "../handler"
import { verifyEnvironmentKey } from "@/utils/validate"
import { CustomError } from "@/utils/errors"

const ExamRoute = new Elysia({ prefix: "/api/exams" })
  .guard({
    beforeHandle({ headers }: { headers: Record<string, string | undefined> }) {
      if (!verifyEnvironmentKey({ headers })) {
        throw new CustomError(401, "Unauthorized")
      }
    },
  })
  .post(
    "/:email",
    ({ params: { email }, body: { testID, answers } }) => sendExam(email, testID, answers),
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
