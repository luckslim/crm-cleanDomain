import { left, right, type Either } from "@/core/either";
import { Model } from "@/domain/enterprise/model";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

import type { modelRepository } from "@/domain/aplication/repository/model-repository";
import type { adminRepository } from "@/domain/aplication/repository/admin-repository";
import type { groupRepository } from "@/domain/aplication/repository/group-repository";
import type { stageRepository } from "@/domain/aplication/repository/stage-repository";
import { Stage } from "@/domain/enterprise/stage";
import { Group } from "@/domain/enterprise/group";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface AggregateModelRequest {
  Id: string;
  modelId: string;
  company?: string | null;
}

type AggregateModelResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { model: Model }
>;

export class AggregateModelUseCase {
  constructor(
    public modelRepository: modelRepository,
    public adminRepository: adminRepository,
    public groupRepository: groupRepository,
    public stageRepository: stageRepository,
  ) {}

  async execute({
    Id,
    modelId,
    company,
  }: AggregateModelRequest): Promise<AggregateModelResponse> {
    // 1. Validar administrador
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const modelExisting = await this.modelRepository.findByAdminId(Id);

    if (modelExisting) {
      return left(new NotAllowedError("há um modelo em uso em seu perfil"));
    }

    // 2. Buscar modelo original
    const originalModel = await this.modelRepository.findById(modelId);

    if (!originalModel) {
      return left(new ResourceNotFoundError(modelId));
    }

    // 3. Buscar grupos do modelo original
    const groups = await this.groupRepository.findManyByModelId(
      originalModel.id.toString(),
    );

    if (!groups || groups.length === 0) {
      return left(new ResourceNotFoundError("Nenhum grupo encontrado"));
    }

    // 4. Criar nova model
    const newModel = Model.create({
      adminId: Id,
      company: company ?? `copy-${originalModel.company}`,
      dateOfCreation: new Date(),
    });

    await this.modelRepository.create(newModel);

    // 5. Recriar grupos e stages
    for (const group of groups) {
      // Buscar stages do grupo original
      const stages = await this.stageRepository.findManyByGroupId(
        group.id.toString(),
      );

      // Criar novo grupo
      const newGroup = Group.create({
        // Copie aqui as propriedades do grupo original
        type: group.type,
        modelId: newModel.id.toString(),
        dateOfCreation: new Date(),
      });

      await this.groupRepository.create(newGroup);

      // Recriar stages
      if (stages && stages.length > 0) {
        for (const stage of stages) {
          const newStage = Stage.create({
            groupId: newGroup.id.toString(),
            name: stage.name,
            dateOfCreation: new Date(),
          });

          await this.stageRepository.create(newStage);
        }
      }
    }

    return right({ model: newModel });
  }
}
