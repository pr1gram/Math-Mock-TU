import { t } from "elysia"
import crypto from "crypto"

interface VerifyEnvResult {
  success: boolean
  message: string
  status?: number
}

export function _createHash(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex")
}

export function _encoded(text: string) {
  return Buffer.from(text, "utf-8").toString("base64")
}

export function _validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function verifyEnvironmentKey(headers: Headers): VerifyEnvResult {
  if (headers.get("x-api-key") === process.env.NEXT_PUBLIC_API_KEY)
    return { success: true, message: "API key verified" }

  return { success: false, message: "API key not verified", status: 401 }
}

export function _StringField(errorMessage: string, required: boolean = true) {
  return required
    ? t.String({ error: errorMessage })
    : t.Optional(t.String({ error: errorMessage }))
}
