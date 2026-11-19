export class NotAllowedError extends Error {
  constructor(message?: string) {
    super(`Não autorizado. ${message}`);
  }
}