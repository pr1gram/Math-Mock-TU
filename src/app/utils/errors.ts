export class CustomError extends Error {
    status?: number
    _status?: number

    constructor(status?: number, message?: string) {
        super(message)
        this.status = status
        this.name = status!.toString()
    }
}