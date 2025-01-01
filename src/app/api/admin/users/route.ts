import { Elysia, error } from "elysia"
import { cors } from "@elysiajs/cors"
import { GlobalGuard } from "@/utils/__init__"
import { TransactionDocumentValidator } from "@/api/admin/admin.dto"
import { renameTransactionDocument } from "@/api/admin/admin.controller"

const AdminRoute = new Elysia({ prefix: "/api/admin/users" })
//   .use(GlobalGuard)
//   .use(cors({ 
//     origin: ['https://math-mock-tu.vercel.app', 'https://www.pretest-tu.com'] 
//   }))
  .post(
    "/",
    async ({ body }) => {
      const res = await renameTransactionDocument(body)
      if (res.success) return res
      if (res.status === 404) return error(404, `Error: ${res.message}`)
      else return error(400, `Error: ${res.message}`)
    },
    {
      body: TransactionDocumentValidator,
    }
  )

export const POST = AdminRoute.handle
