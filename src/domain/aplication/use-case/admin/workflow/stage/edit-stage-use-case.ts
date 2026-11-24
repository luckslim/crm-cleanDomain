import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { modelRepository } from "../../../../repository/model-repository";
import type { stageRepository } from "../../../../repository/stage-repository";
import type { groupRepository } from "../../../../repository/group-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface EditStageRequest {
  Id: string; //id from jwt
  stageId: string;
  name: string;
  color?: string;
}

type EditStageResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { message: string }
>;
export class EditStageUseCase {
  constructor(
    public modelRepository: modelRepository,
    public groupRepository: groupRepository,
    public stageRepository: stageRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({
    Id,
    stageId,
    name,
    color,
  }: EditStageRequest): Promise<EditStageResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const stage = await this.stageRepository.findById(stageId);

    if (!stage) {
      return left(new ResourceNotFoundError("etapa não encontrada"));
    }

    const group = await this.groupRepository.findById(stage.groupId);

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

    stage.name = name;
    stage.color = color ?? null;

    await this.stageRepository.save(stage);

    return right({ message: "Etapa do Grupo foi editada com sucesso!" });
  }
}
