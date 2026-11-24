import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { modelRepository } from "../../../../repository/model-repository";
import type { stageRepository } from "../../../../repository/stage-repository";
import type { groupRepository } from "../../../../repository/group-repository";
import { Stage } from "@/domain/enterprise/stage";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface CreateStageRequest {
  Id: string; //id from jwt
  groupId: string;
  name: string;
  color?: string;
}

type CreateStageResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { message: string }
>;
export class CreateStageUseCase {
  constructor(
    public modelRepository: modelRepository,
    public groupRepository: groupRepository,
    public stageRepository: stageRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({
    Id,
    groupId,
    name,
    color,
  }: CreateStageRequest): Promise<CreateStageResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const group = await this.groupRepository.findById(groupId);

    if (!group) {
      return left(new ResourceNotFoundError("grupo não encontrado"));
    }

    const model = await this.modelRepository.findById(group.modelId);

    if (!model) {
      return left(new ResourceNotFoundError("model não encontrada"));
    }

    if (model.adminId != admin.id.toString()) {
      return left(new NotAllowedError("modelo e administrador incompatíveis."));
    }

    const stage = Stage.create({
      groupId,
      name,
      color: color ?? null,
      dateOfCreation: new Date(),
    });

    await this.stageRepository.create(stage);

    return right({ message: "Etapa do Grupo foi criada com sucesso!" });
  }
}
