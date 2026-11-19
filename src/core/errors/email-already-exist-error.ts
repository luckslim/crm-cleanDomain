export class EmailAlreadyExistError extends Error {
  constructor(message?: string) {
    super(`Email já existente. ${message}`);
  }
}