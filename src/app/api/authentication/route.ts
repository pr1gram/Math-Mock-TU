import { Elysia, t } from "elysia"
import { createUser, deleteUser, getUser, updateUser, generateJWT } from "./handler"
import { StringField } from "@/utils/__init__"
import { verifyEnvironmentKey } from "@/utils/validate"
import { cors } from '@elysiajs/cors'

const AuthRoute = new Elysia({ prefix: "/api/authentication"})
  .use(cors())
  .guard({
    beforeHandle({ headers, error }) {
      if(!headers){
        return error(401, `Error: Headers must be provided`)
      }
      const res = verifyEnvironmentKey(headers)
      if (!res.success) {
        return error(401, `Error: ${res.message}, headers: ${res.headers}, E-headers: ${JSON.stringify(headers)}`)
      }
    },
  })
  .post("/", async ({ error, body }) => {
    const res = await createUser(body)
    console.log(res)
    if(res.success) return res
    return error(400, `Error: ${res.message}`)
  }, {
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
    async ({ params: { email }, error }) => {
      const res = await getUser(email)
      if(res.success) return res
      return error(400, `Error: ${res.message}`)
    },
    {
      params: t.Object({
        email: StringField("Email must be provided"),
      }),
    }
  )
  .patch("/:email", async ({ params: { email }, body, error }) => {
    const res = await updateUser(email, body)
    if(res.success) return res
    return error(400, `Error: ${res.message}`)
  }, {
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
  .delete("/", async ({ body, error }) => {
    const res = await deleteUser(body)
    if(res.success) return res
    return error(400, `Error: ${res.message}`)
  }, {
    body: t.Object({
      email: StringField("String must be provided"),
      environmentKey: StringField("Environment key must be provided"),
    }),
  })

export const POST = AuthRoute.handle
export const DELETE = AuthRoute.handle
