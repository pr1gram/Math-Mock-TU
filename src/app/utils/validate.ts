import { t } from "elysia"
import crypto from "crypto"

export function _createHash(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex")
}

export function _validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function verifyEnvironmentKey(headers: any): any {
  if(!headers) return { success: false, message: "Headers not found", headers: JSON.stringify(headers) }
  if(!headers.get('x-api-key')) return { success: false, message: "API key not found" , headers:JSON.stringify(headers)}
  if(!process.env.NEXT_PUBLIC_API_KEY) return { success: false, message: "ENV key not found", headers: JSON.stringify(headers) }
  if(headers.get('x-api-key') === process.env.NEXT_PUBLIC_API_KEY) return { success: true, message: "API key verified"}
}

export function _StringField(errorMessage: string, required: boolean = true) {
  return required
    ? t.String({ error: errorMessage })
    : t.Optional(t.String({ error: errorMessage }))
}
