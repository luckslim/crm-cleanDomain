import { left, right, type Either } from "@/core/either";
import { EmailAlreadyExistError } from "@/core/errors/email-already-exist-error";
import type { adminRepository } from "../../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { Encrypter } from "../../../cryptography/encrypter";
import type { HashComparer } from "../../../cryptography/hash-comparer";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials-error";

interface GetAdminRequest {
  email: string;
  password: string;
}

type GetAdminResponse = Either<
  EmailAlreadyExistError,
  { access_token: string }
>;
export class GetAdminUseCase {
  constructor(
    public adminRepository: adminRepository,
    public hashComparer: HashComparer,
    public encrypter: Encrypter,
  ) {}
  async execute({
    email,
    password,
  }: GetAdminRequest): Promise<GetAdminResponse> {
    const admin = await this.adminRepository.findByEmail(email);

    if (!admin) {
      return left(new ResourceNotFoundError(email));
    }

    const passwordValid = await this.hashComparer.comparer(
      password,
      admin.password,
    );

    if (!passwordValid) {
      return left(new WrongCredentialsError());
    }

    const access_token = await this.encrypter.encrypt({
      sub: admin.id,
    });

    return right({ access_token });
  }
}
