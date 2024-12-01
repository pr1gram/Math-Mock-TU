import { Elysia, error, t } from "elysia"
import { cors } from '@elysiajs/cors'
import { generateJWT } from "@/api/authentication/auth.controller"
import { GlobalGuard, StringField } from "@/utils/__init__"

const AuthRoute = new Elysia({ prefix: "/api/authentication" })
  .use(GlobalGuard)
  .use(cors())
  .post(
  "/session",
  async ({ body: { email } }) => {
    const res = await generateJWT(email)
    if (res.success) return res
    else return error(400, `Error: ${res.message}`)
  },
  {
    body: t.Object({
      email: StringField("String must be provided"),
    }),
  },
)

export const POST = AuthRoute.handle
