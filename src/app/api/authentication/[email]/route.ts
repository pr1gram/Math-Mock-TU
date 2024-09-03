import { Elysia, t } from 'elysia'
import { getUser, updateUser } from '@/api/authentication/handler'
import { elysiaFault } from 'elysia-fault'
import { StringField } from '@/utils/__init__'

const AuthRoute = new Elysia({ prefix: '/api/authentication' })
	.use(elysiaFault())
	.get('/:email', ({ params: { email } }) => getUser(email), {
		params: t.Object({
			email: StringField('Email must be provided'),
		}),
	})
	.patch('/:email', ({ params: { email }, body }) => updateUser(email, body), {
		params: t.Object({
			email: StringField('String must be provided'),
		}),
		body: t.Object({
			firstname: StringField('Firstname must be provided', false),
			lastname: StringField('Lastname must be provided', false),
			username: StringField('Username must be provided', false),
			tel: StringField('Tel must be provided', false),
		}),
	})

export const GET = AuthRoute.handle
export const PATCH = AuthRoute.handle
