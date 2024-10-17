export interface Transaction {
  testID: string
  date: string
  fileURL: string
  status: string
  time: string
}

export interface CategorizedData {
  [testID: string]: {
    email: string
    date: string
    fileURL: string
    status: string
    time: string
  }[]
}
