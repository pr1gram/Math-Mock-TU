import Elysia, { t } from 'elysia'
import { StringField } from '@/utils/__init__'
import { getTransaction } from '@/api/transaction/handler'

const TransactionRoute = new Elysia({ prefix: '/api/transaction' }).get(
	'/:email/:testID',
	async ({ params: { email, testID } }) => await getTransaction(email, testID),
	{
		params: t.Object({
			email: StringField('Email must be provided'),
			testID: StringField('TestID must be provided'),
		}),
	}
)

export const GET = TransactionRoute.handle
