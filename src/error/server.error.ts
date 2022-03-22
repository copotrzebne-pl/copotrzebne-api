export default class ServerError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = status;
  }

  public getStatus(): number {
    return this.status;
  }
}
