export interface Slip {
  email: string
  file: File
  date?: string
  time?: string
  price?: string
  testID?: string
  status?: string
}

export enum Status {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}
