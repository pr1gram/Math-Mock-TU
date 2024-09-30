import { Elysia, t, error } from "elysia"
import { StringField } from "@/utils/__init__"
import { examList, deleteExamList, getExamList } from "../handler"
import { verifyEnvironmentKey } from "@/utils/validate"

const ExamRoute = new Elysia({ prefix: "/api/exams/examlists" })
  .guard({
    beforeHandle({ headers }: { headers: Record<string, string | undefined> }) {
      if (!verifyEnvironmentKey({ headers })) {
        return error(401, "Unauthorized")
      }
    },
  })
  .post(
    "/",
    async ({ body, error }) => {
      const res = await examList(body)
      if (res.success) return res
      else return error(404, res.message)
    },
    {
      body: t.Object({
        title: StringField("Title must be provided"),
        description: StringField("Description must be provided correctly"),
        date: StringField("Date must be provided"),
        price: t.Number({ message: "Price must be provided" }),
        duration: t.Number({ message: "Duration must be provided" }),
      }),
    }
  )
  .get("/", async () => {
    const res = await getExamList()
    if (res.success) return res
    else return error(404, res.message)
  })
  .delete(
    "/",
    async ({ body: { title }, error }) => {
      const res = await deleteExamList(title)
      if (res.success) return res
      else return error(404, res.message)
    },
    {
      body: t.Object({
        title: StringField("Title must be provided"),
      }),
    }
  )

export const POST = ExamRoute.handle
export const GET = ExamRoute.handle
export const DELETE = ExamRoute.handle
