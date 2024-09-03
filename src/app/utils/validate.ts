import { t } from 'elysia'
import crypto from 'crypto'

export const _createHash = (text: string) => crypto.createHash('sha256').update(text).digest('hex')
export const _encoded = (text: string) => Buffer.from(text, 'utf-8').toString('base64')

export function _validateEmail(email: string) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

export function _StringField(errorMessage: string, required: boolean = true) {
	return required
		? t.String({ error: errorMessage })
		: t.Optional(t.String({ error: errorMessage }))
}
