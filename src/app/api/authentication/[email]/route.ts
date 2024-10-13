import { Elysia, error, t } from "elysia"
import { getUser, updateUser } from "@/api/authentication/auth.controller"
import { GlobalGuard, StringField } from "@/utils/__init__"

const AuthRoute = new Elysia({ prefix: "/api/authentication" })
  .use(GlobalGuard)
  .get(
    "/:email",
    async ({ params: { email } }) => {
      const res = await getUser(email)
      if (res.success) return res.data
      else return error(400, `Error: ${res.message}`)
    },
    {
      params: t.Object({
        email: StringField("Email must be provided"),
      }),
    },
  )
  .patch(
    "/:email",
    async ({ params: { email }, body }) => {
      const res = await updateUser(email, body)
      if (res.success) return res
      else return error(400, `Error: ${res.message}`)
    },
    {
      params: t.Object({
        email: StringField("String must be provided"),
      }),
      body: t.Object({
        firstname: StringField("Firstname must be provided", false),
        lastname: StringField("Lastname must be provided", false),
        username: StringField("Username must be provided", false),
        school: StringField("School must be provided", false),
        tel: StringField("Tel must be provided", false),
      }),
    },
  )

export const GET = AuthRoute.handle
export const PATCH = AuthRoute.handle
