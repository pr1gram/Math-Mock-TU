import { Elysia, t } from "elysia"
import { elysiaFault } from "elysia-fault"
import { StringField } from "@/utils/__init__"
import { sendExam } from "../handler"

const ExamRoute = new Elysia({ prefix: "/api/exams" }).post(
  "/:email",
  ({ params: { email }, body: { testID, answers, environmentKey } }) =>
    sendExam(email, testID, answers, environmentKey),
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
