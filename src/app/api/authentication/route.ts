import { Elysia, error, t } from "elysia"
import { cors } from '@elysiajs/cors'
import { createUser, deleteUser, getUser, updateUser } from "./auth.controller"
import { AuthValidator } from "./auth.dto"
import { GlobalGuard, StringField } from "@/utils/__init__"

const Route = new Elysia({ prefix: "/api/authentication" })
  .use(GlobalGuard)
  .use(cors({origin: 'https://math-mock-tu.vercel.app'}))
  .post(
    "/",
    async ({ body }) => {
      const res = await createUser(body)
      if (res.success) return res
      else return error(400, `Error: ${res.message}`)
    },
    {
      body: AuthValidator,
    },
  )
  .get(
    "/:email",
    async ({ params: { email } }) => {
      const res = await getUser(email)
      if (res.success) return res
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
        tel: StringField("Tel must be provided", false),
        school: StringField("school must be provided", false),
      }),
    },
  )
  .delete(
    "/",
    async ({ body }) => {
      const res = await deleteUser(body)
      if (res.success) return res
      else return error(400, `Error: ${res.message}`)
    },
    {
      body: t.Object({
        email: StringField("String must be provided"),
      }),
    },
  )

export const POST = Route.handle
export const DELETE = Route.handle
