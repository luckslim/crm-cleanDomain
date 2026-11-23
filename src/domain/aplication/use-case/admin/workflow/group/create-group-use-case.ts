import { left, right, type Either } from "@/core/either";
import { Group } from "@/domain/enterprise/group";
import type { adminRepository } from "../../../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { groupRepository } from "../../../../repository/group-repository";
import type { modelRepository } from "../../../../repository/model-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface CreateGroupRequest {
  Id: string; //id from jwt
  modelId: string;
  type: string;
}

type CreateGroupResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { message: string }
>;
export class CreateGroupUseCase {
  constructor(
    public modelRepository: modelRepository,
    public groupRepository: groupRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({
    Id,
    modelId,
    type,
  }: CreateGroupRequest): Promise<CreateGroupResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const model = await this.modelRepository.findById(modelId);

    if (!model) {
      return left(new ResourceNotFoundError(modelId));
    }

    if (model.adminId != admin.id.toString()) {
      return left(new NotAllowedError("modelo e administrador incompatíveis."));
    }

    const group = Group.create({
      modelId,
      type,
      dateOfCreation: new Date(),
    });

    await this.groupRepository.create(group);

    return right({ message: "Sua groupo de trabalho foi criado com sucesso!" });
  }
}
