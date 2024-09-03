import Elysia, { t } from 'elysia'
import { StringField } from '@/utils/__init__'
import { updateStatus, userTransactions } from '@/api/transaction/handler'

const TransactionRoute = new Elysia({ prefix: '/api/transaction' })
	.get('/:email', async ({ params: { email } }) => await userTransactions(email), {
		params: t.Object({
			email: StringField('Email must be provided'),
		}),
	})
	.patch('/:email', async ({ params: { email }, body: { testID } }) => await updateStatus(email, testID), {
		params: t.Object({
			email: StringField('Email must be provided'),
		}),
		body: t.Object({
			testID: StringField('TestID must be provided')
		})
	})

export const GET = TransactionRoute.handle
export const PATCH = TransactionRoute.handle
