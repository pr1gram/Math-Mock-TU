"use client"

import { Elysia } from 'elysia'

const app = new Elysia()

export class HTTPError extends Error {
	public constructor(public message: string, public statusCode: number, public errorData?: any) {
		super(message)
		this.name = 'HTTPError'
	}

	// Static methods to create different types of HTTP errors
	public static BadRequest(message?: string, errorData?: any) {
		return new HTTPError(message || 'Bad Request', 400, errorData)
	}

	public static Unauthorized(message?: string, errorData?: any) {
		return new HTTPError(message || 'Unauthorized', 401, errorData)
	}

	public static PaymentRequired(message?: string, errorData?: any) {
		return new HTTPError(message || 'Payment Required', 402, errorData)
	}

	public static Forbidden(message?: string, errorData?: any) {
		return new HTTPError(message || 'Forbidden', 403, errorData)
	}

	public static NotFound(message?: string, errorData?: any) {
		return new HTTPError(message || 'Not Found', 404, errorData)
	}

	public static MethodNotAllowed(message?: string, errorData?: any) {
		return new HTTPError(message || 'Method Not Allowed', 405, errorData)
	}

	public static Conflict(message?: string, errorData?: any) {
		return new HTTPError(message || 'Conflict', 409, errorData)
	}

	public static UnsupportedMediaType(message?: string, errorData?: any) {
		return new HTTPError(message || 'Unsupported Media Type', 415, errorData)
	}

	public static IAmATeapot(message?: string, errorData?: any) {
		return new HTTPError(message || "I'm a Teapot", 418, errorData)
	}

	public static TooManyRequests(message?: string, errorData?: any) {
		return new HTTPError(message || 'Too Many Requests', 429, errorData)
	}

	public static Internal(message?: string, errorData?: any) {
		return new HTTPError(message || 'Internal Server Error', 500, errorData)
	}

	public static NotImplemented(message?: string, errorData?: any) {
		return new HTTPError(message || 'Not Implemented', 501, errorData)
	}

	public static BadGateway(message?: string, errorData?: any) {
		return new HTTPError(message || 'Bad Gateway', 502, errorData)
	}

	public static ServiceUnavailable(message?: string, errorData?: any) {
		return new HTTPError(message || 'Service Unavailable', 503, errorData)
	}

	public static GatewayTimeout(message?: string, errorData?: any) {
		return new HTTPError(message || 'Gateway Timeout', 504, errorData)
	}
}

interface HttpErrorConstructor {
	customFormatter?: (error: HTTPError) => any
	returnStringOnly?: boolean
}

export const httpError = (
	params: HttpErrorConstructor = {
		customFormatter: undefined,
		returnStringOnly: false,
	}
) =>
	app
		.error({
			ELYSIA_HTTP_ERROR: HTTPError,
		})
		.onError({ as: 'global' }, ({ code, error, set }) => {
			if (code === 'ELYSIA_HTTP_ERROR') {
				set.status = error.statusCode
				if (params.customFormatter) {
					return params.customFormatter(error)
				}
				if (params.returnStringOnly) {
					return error.message
				}
				return {
					error: true,
					code: error.statusCode,
					message: error.message,
					data: error.errorData,
				}
			}
		})
