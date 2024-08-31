import { _createHash, _encoded, _validateEmail, _StringField } from '@/utils/validate'
import { _ErrorFromType, _error } from '@/utils/logging'
import { _isUsernameExist, _getDocumentByEmail } from '@/utils/firebase'

export const createHash = _createHash
export const encoded = _encoded
export const validateEmail = _validateEmail
export const StringField = _StringField
export const error = _error
export const ErrorFromType = _ErrorFromType
export const isUsernameExist = _isUsernameExist
export const getDocumentByEmail = _getDocumentByEmail
