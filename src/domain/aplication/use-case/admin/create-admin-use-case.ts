import { left, right, type Either } from "@/core/either";
import { EmailAlreadyExistError } from "@/core/errors/email-already-exist-error";
import { Admin } from "@/domain/enterprise/admin";
import type { HashGenerator } from "../../cryptography/hash-generator";
import type { adminRepository } from "../../repository/admin-repository";

interface CreateAdminRequest {
  email: string;
  password: string;
  adminName: string;
  dateOfCreation: Date;
}

type CreateAdminResponse = Either<EmailAlreadyExistError, { message: string }>;
export class CreateAdminUseCase {
  constructor(
    public adminRepository: adminRepository,
    public hashGenerator: HashGenerator,
  ) {}
  async execute({
    email,
    password,
    adminName,
    dateOfCreation,
  }: CreateAdminRequest): Promise<CreateAdminResponse> {
    const emailExisting = await this.adminRepository.findByEmail(email);

    if (emailExisting) {
      return left(new EmailAlreadyExistError());
    }

    const passwordHashed = await this.hashGenerator.hash(password);

    const admin = Admin.create({
      adminName,
      email,
      password: passwordHashed,
      urlImage: "undefined",
      dateOfCreation,
    });

    await this.adminRepository.create(admin);

    return right({ message: "Sua conta foi criada com sucesso!" });
  }
}
