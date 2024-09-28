import { _createHash, _validateEmail, _validateEnvironmentKey, _StringField } from "@/utils/validate"
import {
  _isUsernameExist,
  _getDocumentByEmail,
  _getSnapshotByQuery,
  _updateSessionDoc,
  _createSessionDoc,
} from "@/utils/firebase"

export const createHash = _createHash
export const validateEmail = _validateEmail
export const validateEnvironmentKey = _validateEnvironmentKey
export const StringField = _StringField
export const isUsernameExist = _isUsernameExist
export const getDocumentByEmail = _getDocumentByEmail
export const getSnapshotByQuery = _getSnapshotByQuery
export const updateSessionDoc = _updateSessionDoc
export const createSessionDoc = _createSessionDoc
