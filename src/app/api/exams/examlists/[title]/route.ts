import { Elysia, t } from "elysia"
import { StringField } from "@/utils/__init__"
import { getExamList, updateExamList } from "../../handler"
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
    .get("/:title", ({ params: { title } }) => getExamList(title), {
        params: t.Object({
            title: StringField("Title must be provided"),
        }),
    })
    .patch("/:title", ({ params: { title }, body }) => updateExamList(title, body), {
        params: t.Object({
            title: StringField("Title must be provided"),
        }),
        body: t.Object({
            title: StringField("Title must be provided", false),
            description: StringField("Description must be provided correctly", false),
            date: StringField("Date must be provided", false),
            price: t.Optional(t.Number({ message: "Price must be provided"})),
            duration: t.Optional(t.Number({ message: "Duration must be provided"})),
        }),
    })

export const GET = ExamRoute.handle
export const PATCH = ExamRoute.handle
