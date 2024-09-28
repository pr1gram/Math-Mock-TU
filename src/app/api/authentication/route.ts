import { Elysia, t } from "elysia"
import { createUser, deleteUser, getUser, updateUser, generateJWT } from "./handler"
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
  .post("/", ({ body }) => createUser(body), {
    body: t.Object({
      email: StringField("String must be provided"),
      firstname: StringField("Firstname must be provided"),
      lastname: StringField("Lastname must be provided"),
      username: StringField("Username must be provided"),
      tel: StringField("Tel must be provided"),
    }),
  })
  .get(
    "/:email",
    ({ params: { email } }) => {
      getUser(email)
    },
    {
      params: t.Object({
        email: StringField("Email must be provided"),
      }),
    }
  )
  .patch("/:email", ({ params: { email }, body, headers }) => updateUser(email, body), {
    params: t.Object({
      email: StringField("String must be provided"),
    }),
    body: t.Object({
      firstname: StringField("Firstname must be provided", false),
      lastname: StringField("Lastname must be provided", false),
      username: StringField("Username must be provided", false),
      tel: StringField("Tel must be provided", false),
      environmentKey: StringField("Tel must be provided"),
    }),
  })
  .delete("/", ({ body }) => deleteUser(body), {
    body: t.Object({
      email: StringField("String must be provided"),
      environmentKey: StringField("Environment key must be provided"),
    }),
  })

export const GET = AuthRoute.handle
export const POST = AuthRoute.handle
export const PATCH = AuthRoute.handle
export const DELETE = AuthRoute.handle
