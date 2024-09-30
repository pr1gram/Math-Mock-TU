import { t } from "elysia"
import crypto from "crypto"

export function _createHash(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex")
}

export function _validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function verifyEnvironmentKey({ headers }: { headers: { [key: string]: string | undefined } }): boolean {
  if (!headers) return false
  if (!headers["x-api-key"]) return false
  if (!process.env.API_KEY) return false
  return headers["x-api-key"] === process.env.API_KEY
}

export function _StringField(errorMessage: string, required: boolean = true) {
  return required
    ? t.String({ error: errorMessage })
    : t.Optional(t.String({ error: errorMessage }))
}
