import Elysia, { t } from 'elysia'
import { StringField } from '@/utils/__init__'
import { transaction, userTransactions } from '@/api/transaction/handler'

export const TransactionRoute = new Elysia({ prefix: '/api/transaction' })
	.get('/:email', async ({ params: { email } }) => await userTransactions(email), {
		params: t.Object({
			email: StringField('Email must be provided'),
		}),
	})

export const POST = TransactionRoute.handle
export const GET = TransactionRoute.handle
