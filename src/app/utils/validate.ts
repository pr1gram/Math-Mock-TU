import { t } from "elysia"
import crypto from "crypto"

export function _createHash(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex")
}

export function _validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// export function verifyEnvironmentKey({ headers }: { headers: { [key: string]: string | undefined } }): boolean {
//   if (!headers) return false
//   if (!headers["x-api-key"]) return false
//   if (!process.env.NEXT_PUBLIC_API_KEY) return false
//   return headers["x-api-key"] === process.env.NEXT_PUBLIC_API_KEY
// }
export function verifyEnvironmentKey(headers: Record<string, string | undefined>): any {
  if(!headers) return { success: false, message: "Headers not found", headers }
  if(!headers['x-api-key']) return { success: false, message: "API key not found" , headers}
  if(!process.env.NEXT_PUBLIC_API_KEY) return { success: false, message: "ENV key not found", headers }
  return headers['x-api-key'] === process.env.NEXT_PUBLIC_API_KEY
  //return headers['x-api-key'] === '34d8e22434adc1e1f826aa74a16c426371ebae91f085ce2437831756c1d1d43f'
}

export function _StringField(errorMessage: string, required: boolean = true) {
  return required
    ? t.String({ error: errorMessage })
    : t.Optional(t.String({ error: errorMessage }))
}
