import { Elysia, t } from "elysia"
import { StringField } from "@/utils/__init__"
import { examList, deleteExamList, getExamList } from "../handler"
import { verifyEnvironmentKey } from "@/utils/validate"
import { CustomError } from "@/utils/errors"

const ExamRoute = new Elysia({ prefix: "/api/exams/examlists" })
  .guard({
    beforeHandle({ headers }: { headers: Record<string, string | undefined> }) {
      if (!verifyEnvironmentKey({ headers })) {
        throw new CustomError(401, "Unauthorized")
      }
    },
  })
  .post("/", ({ body }) => examList(body), {
    body: t.Object({
      title: StringField("Title must be provided"),
      description: StringField("Description must be provided correctly"),
      date: StringField("Date must be provided"),
      price: t.Number({ message: "Price must be provided" }),
      duration: t.Number({ message: "Duration must be provided" }),
    }),
  })
  .get("/", () => getExamList())
  .delete("/", ({ body: { title } }) => deleteExamList(title), {
    body: t.Object({
      title: StringField("Title must be provided"),
    }),
  })

export const POST = ExamRoute.handle
export const GET = ExamRoute.handle
export const DELETE = ExamRoute.handle
