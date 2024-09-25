import { Elysia, t } from "elysia"
import { elysiaFault } from "elysia-fault"
import { generateJWT } from "../handler"
import { StringField } from "@/utils/__init__"

const AuthRoute = new Elysia({ prefix: "/api/authentication" })
  .use(elysiaFault())
  .post("/session", ({ body: { email } }) => generateJWT(email), {
    body: t.Object({
      email: StringField("String must be provided"),
    }),
  })

export const GET = AuthRoute.handle
export const POST = AuthRoute.handle
export const PATCH = AuthRoute.handle
export const DELETE = AuthRoute.handle
