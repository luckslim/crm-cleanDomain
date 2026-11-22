import { left, right, type Either } from "@/core/either";
import { EmailAlreadyExistError } from "@/core/errors/email-already-exist-error";
import type { HashGenerator } from "../../../cryptography/hash-generator";
import type { adminRepository } from "../../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface EditAdminRequest {
  Id: string; //Id from jwt
  email: string;
  password: string;
  adminName: string;
}

type EditAdminResponse = Either<
  EmailAlreadyExistError | ResourceNotFoundError,
  { message: string }
>;
export class EditAdminUseCase {
  constructor(
    public adminRepository: adminRepository,
    public hashGenerator: HashGenerator,
  ) {}
  async execute({
    Id,
    email,
    password,
    adminName,
  }: EditAdminRequest): Promise<EditAdminResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const adminForEmail = await this.adminRepository.findByEmail(email);

    if (adminForEmail && adminForEmail.id.toString() !== admin.id.toString()) {
      return left(new EmailAlreadyExistError());
    }

    const passwordHashed = await this.hashGenerator.hash(password);

    admin.email = email;
    admin.password = passwordHashed;
    admin.adminName = adminName;
    admin.urlImage = "undefined";

    await this.adminRepository.save(admin);

    return right({ message: "Seus Dados foram Alterados com sucesso!" });
  }
}
