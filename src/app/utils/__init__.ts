import { _createHash, _validateEmail, _StringField, _encoded } from "@/utils/validate"
import { _GlobalGuard } from "@/utils/globalguard"
import {
  _isUsernameExist,
  _getDocumentByEmail,
  _getDocumentById,
  _getSnapshotByQuery,
  _renameDocument,
  _updateSessionDoc,
  _createSessionDoc,
} from "@/utils/firebase"

export const GlobalGuard = _GlobalGuard
export const createHash = _createHash
export const encoded = _encoded
export const validateEmail = _validateEmail
export const StringField = _StringField
export const isUsernameExist = _isUsernameExist
export const getDocumentByEmail = _getDocumentByEmail
export const getDocumentById = _getDocumentById
export const getSnapshotByQuery = _getSnapshotByQuery
export const renameDocument = _renameDocument
export const updateSessionDoc = _updateSessionDoc
export const createSessionDoc = _createSessionDoc
