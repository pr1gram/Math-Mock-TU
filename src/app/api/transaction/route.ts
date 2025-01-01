import { Elysia, error } from "elysia"
import { cors } from "@elysiajs/cors"
import { GlobalGuard } from "@/utils/__init__"
import { transaction } from "./transaction.controller"
import { TransactionValidator } from "@/api/transaction/transaction.dto"

const TransactionRoute = new Elysia({ prefix: "/api/transaction" })
  // .use(GlobalGuard)
  .use(cors({ 
    origin: ['https://math-mock-tu.vercel.app', 'https://www.pretest-tu.com'] 
  }))
  .post(
    "/",
    async ({ body }) => {
      const res = await transaction(body)
      if (res.success) return res
      if (res.status === 404) return error(404, `Error: ${res.message}`)
      else return error(400, `Error: ${res.message}`)
    },
    {
      body: TransactionValidator,
    }
  )

export const POST = TransactionRoute.handle
export const GET = TransactionRoute.handle
