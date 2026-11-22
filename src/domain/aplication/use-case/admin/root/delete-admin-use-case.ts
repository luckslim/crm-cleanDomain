import { left, right, type Either } from "@/core/either";

import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { adminRepository } from "../../../repository/admin-repository";

interface DeleteAdminRequest {
  Id: string; //id from jwt
}

type DeleteAdminResponse = Either<ResourceNotFoundError, { message: string }>;
export class DeleteAdminUseCase {
  constructor(public adminRepository: adminRepository) {}
  async execute({ Id }: DeleteAdminRequest): Promise<DeleteAdminResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    await this.adminRepository.delete(admin.id.toString());

    return right({ message: "Conta cancelada com Sucesso!" });
  }
}
