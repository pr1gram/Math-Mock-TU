import { Elysia, t, error } from "elysia"
import { StringField, GlobalGuard} from "@/utils/__init__"
import { startExam } from "../handler"

const ExamStartRoute = new Elysia({ prefix: "/api/exams" })
  .use(GlobalGuard)
  .post(
    "/start",
    async ({ body: { email, testID }}) => {
      const res = await startExam(email, testID)
      if (res.success) return res
      else return error(404, res.message)
    },
    {
      body: t.Object({
        email: StringField("Title must be provided"),
        testID: StringField("Answer must be provided correctly"),
      }),
    }
  )

export const POST = ExamStartRoute.handle
