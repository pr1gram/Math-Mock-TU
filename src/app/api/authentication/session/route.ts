import { Elysia, t, error } from "elysia"
import { generateJWT } from "../handler"
import { StringField, GlobalGuard} from "@/utils/__init__"

const AuthRoute = new Elysia({ prefix: "/api/authentication" })
  .use(GlobalGuard)
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
    }
  )

export const POST = AuthRoute.handle
