export enum _ErrorFromType {
	GET = 1,
	POST = 2,
	PUT = 3,
	PATCH = 4,
	DELETE = 5,
}

const errorMessages: Record<_ErrorFromType, string> = {
	[_ErrorFromType.GET]: 'getting',
	[_ErrorFromType.POST]: 'posting',
	[_ErrorFromType.PUT]: 'updating',
	[_ErrorFromType.PATCH]: 'updating',
	[_ErrorFromType.DELETE]: 'deleting',
}

export function _error(title: string, error_type: _ErrorFromType) {
	const action = errorMessages[error_type] || 'unknown action'
	console.error(`Error while ${action} ${title}`)
}
