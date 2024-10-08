import { Elysia, t, error } from "elysia"
import { StringField, GlobalGuard } from "@/utils/__init__"
import { examList, deleteExamList, getExamList } from "../handler"

const ExamRoute = new Elysia({ prefix: "/api/exams/examlists" })
  .use(GlobalGuard)
  .post(
    "/",
    async ({ body }) => {
      const res = await examList(body)
      if (res.success) return res
      else return error(404, res.message)
    },
    {
      body: t.Object({
        title: StringField("Title must be provided"),
        description: StringField("Description must be provided correctly"),
        items: t.Number({ message: "Item must be provided" }),
        date: StringField("Date must be provided"),
        price: t.Number({ message: "Price must be provided" }),
        duration: t.Number({ message: "Duration must be provided" }),
        startTime: t.Number({ message: "Start Time must be provided" }),
        endTime: t.Number({ message: "End Time must be provided" }),
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
    async ({ body: { title } }) => {
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
