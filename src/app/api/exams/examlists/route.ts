import { Elysia, error, t } from "elysia"
import { GlobalGuard, StringField } from "@/utils/__init__"
import { deleteExamList, examList, getExamList } from "@/api/exams/exams.controller"
import { ExamListsValidator } from "@/api/exams/exams.dto"

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
      body: ExamListsValidator,
    },
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
    },
  )

export const POST = ExamRoute.handle
export const GET = ExamRoute.handle
export const DELETE = ExamRoute.handle
