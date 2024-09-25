import { _createHash, _encoded, _validateEmail, _StringField } from "@/utils/validate"
import { _isUsernameExist, _getDocumentByEmail, _updateSessionDoc, _createSessionDoc } from "@/utils/firebase"

export const createHash = _createHash
export const encoded = _encoded
export const validateEmail = _validateEmail
export const StringField = _StringField
export const isUsernameExist = _isUsernameExist
export const getDocumentByEmail = _getDocumentByEmail
export const updateSessionDoc = _updateSessionDoc
export const createSessionDoc = _createSessionDoc