import { left, right, type Either } from "@/core/either";
import { EmailAlreadyExistError } from "@/core/errors/email-already-exist-error";
import { Admin } from "@/domain/enterprise/admin";
import type { adminRepository } from "../../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface GetAdminRequest {
  Id: string; //Id from jwt
}

type GetAdminResponse = Either<EmailAlreadyExistError, { admin: Admin }>;
export class GetAdminUseCase {
  constructor(public adminRepository: adminRepository) {}
  async execute({ Id }: GetAdminRequest): Promise<GetAdminResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    return right({ admin });
  }
}
