import { Elysia, t } from "elysia"
import { generateJWT } from "../handler"
import { StringField } from "@/utils/__init__"
import { verifyEnvironmentKey } from "@/utils/validate"

const AuthRoute = new Elysia({ prefix: "/api/authentication" })
  .guard({
    beforeHandle({ headers, error }) {
      const res = verifyEnvironmentKey({ headers })
      if (!res) {
        return error(401, `Error: ${res.message}`)
      }
    },
  })
  .post("/session", async ({ body: { email }, error }) => {
    const res = await generateJWT(email)
    if (res.success) return res
    return error(400, `Error: ${res.message}`)
  }, {
    body: t.Object({
      email: StringField("String must be provided"),
    }),
  })

export const POST = AuthRoute.handle
