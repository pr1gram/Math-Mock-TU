import { Elysia, error, t } from "elysia"
import { cors } from '@elysiajs/cors'
import { getPendingUsers } from "../../admin.controller"
import { GlobalGuard, StringField } from "@/utils/__init__"

const Route = new Elysia({ prefix: "/api/admin/users" })
  .use(GlobalGuard)
  .use(cors({ 
    origin: ['https://math-mock-tu.vercel.app', 'https://www.pretest-tu.com'] 
  }))
  .get(
    "/:email",
  async ({ params: { email } }) => {
    const res = await getPendingUsers(email)
    if (res.success) return res
    else return error(res?.status || 400, `Error: ${res.message}`)
  },
  {
    params: t.Object({
      email: StringField("Email must be provided"),
    }),
  },
  )

export const GET = Route.handle
