import { Elysia, t, error } from "elysia"
import { StringField } from "@/utils/__init__"
import { getExamList, updateExamList } from "../../handler"
import { verifyEnvironmentKey } from "@/utils/validate"

const ExamRoute = new Elysia({ prefix: "/api/exams/examlists" })
  .guard({
    beforeHandle({ headers, error }) {
      const res = verifyEnvironmentKey({ headers })
      if (!res.success) {
        return error(401, `Error: ${res.message}`)
      }
    },
  })
  .get(
    "/:title",
    async ({ params: { title }, error }) => {
      const res = await getExamList(title)
      if (res.success) return res
      else return error(404, res.message)
    },
    {
      params: t.Object({
        title: StringField("Title must be provided"),
      }),
    }
  )
  .patch(
    "/:title",
    async ({ params: { title }, body, error }) => {
      const res = await updateExamList(title, body)
      if (res.success) return res
      else return error(404, res.message)
    },
    {
      params: t.Object({
        title: StringField("Title must be provided"),
      }),
      body: t.Object({
        title: StringField("Title must be provided", false),
        description: StringField("Description must be provided correctly", false),
        date: StringField("Date must be provided", false),
        price: t.Optional(t.Number({ message: "Price must be provided" })),
        duration: t.Optional(t.Number({ message: "Duration must be provided" })),
      }),
    }
  )

export const GET = ExamRoute.handle
export const PATCH = ExamRoute.handle
