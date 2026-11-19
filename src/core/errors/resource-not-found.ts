export class ResourceNotFoundError extends Error {
  constructor(message?: string) {
    super(`Recurso não encontrado. ${message}`);
  }
}