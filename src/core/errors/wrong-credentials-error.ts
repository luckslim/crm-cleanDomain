export class WrongCredentialsError extends Error {
  constructor() {
    super(`Credencial Inválida!`);
  }
}