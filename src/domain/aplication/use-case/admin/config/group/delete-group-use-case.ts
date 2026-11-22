import { left, right, type Either } from "@/core/either";
import { EmailAlreadyExistError } from "@/core/errors/email-already-exist-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { adminRepository } from "@/domain/aplication/repository/admin-repository";
import type { groupRepository } from "@/domain/aplication/repository/group-repository";
import type { modelRepository } from "@/domain/aplication/repository/model-repository";

interface DeleteGroupRequest {
  Id: string; //Id from jwt
  groupId: string;
}

type DeleteGroupResponse = Either<
  EmailAlreadyExistError | ResourceNotFoundError,
  { message: string }
>;
export class DeleteGroupUseCase {
  constructor(
    public groupRepository: groupRepository,
    public adminRepository: adminRepository,
    public modelRepository: modelRepository,
  ) {}
  async execute({
    Id,
    groupId,
  }: DeleteGroupRequest): Promise<DeleteGroupResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const group = await this.groupRepository.findById(groupId);

    if (!group) {
      return left(new ResourceNotFoundError(groupId));
    }

    const model = await this.modelRepository.findById(group.modelId);

    if (!model) {
      return left(new ResourceNotFoundError(group.modelId));
    }

    if (model.adminId != admin.id.toString()) {
      return left(new NotAllowedError("model e administrador incompatíveis"));
    }

    await this.groupRepository.delete(group.id.toString());

    return right({ message: "Dados Alterados com sucesso!" });
  }
}
