import { Elysia, t } from "elysia"
import { generateJWT } from "../handler"
import { StringField } from "@/utils/__init__"
import { verifyEnvironmentKey } from "@/utils/validate"
import { CustomError } from "@/utils/errors"

const AuthRoute = new Elysia({ prefix: "/api/authentication" })
  .guard({
    beforeHandle({ headers }: { headers: Record<string, string | undefined> }) {
      if (!verifyEnvironmentKey({ headers })) {
        throw new CustomError(401, "Unauthorized")
      }
    },
  })
  .post("/session", ({ body: { email } }) => generateJWT(email), {
    body: t.Object({
      email: StringField("String must be provided"),
    }),
  })

export const POST = AuthRoute.handle
