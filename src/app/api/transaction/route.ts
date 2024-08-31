import Elysia, { t } from 'elysia'
import { StringField } from '../../utils/__init__'
import { transaction, userTransactions } from '@/api/transaction/handler'

const TransactionRoute = new Elysia({ prefix: '/api/transaction' })
	.post('/', async ({ body }) => await transaction(body), {
		body: t.Object({
			email: t.String({
				error: StringField('User email must be provided'),
			}),
			file: t.File({
				error: 'Image file must be provided',
			}),
			date: StringField('Date must be provided'), // DD/MM/YYYY
			time: StringField('Time must be provided'), // 19:58
			price: StringField('Price must be provided'), // 999
			testID: StringField('Test ID must be provided'), //TODO
		}),
	})
	.get('/:email', async ({ params: { email } }) => await userTransactions(email), {
		params: t.Object({
			email: StringField('Email must be provided'),
		}),
	})

export const POST = TransactionRoute.handle
export const GET = TransactionRoute.handle
