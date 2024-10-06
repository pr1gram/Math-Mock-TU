import { Elysia, error } from "elysia"
import { verifyEnvironmentKey } from "@/utils/validate"

export const _GlobalGuard = new Elysia()
  .onBeforeHandle(({ request: { headers } }) => {
    console.log("GlobalGuard Executed")
    const res = verifyEnvironmentKey(headers)
    if (!res.success) return error(401, `Error: ${res.message}`)
  })
  .as('plugin')
