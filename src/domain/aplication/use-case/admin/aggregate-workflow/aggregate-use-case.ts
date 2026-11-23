import { left, right, type Either } from "@/core/either";
import { Model } from "@/domain/enterprise/model";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { modelRepository } from "@/domain/aplication/repository/model-repository";
import type { adminRepository } from "@/domain/aplication/repository/admin-repository";
import type { groupRepository } from "@/domain/aplication/repository/group-repository";
import type { stageRepository } from "@/domain/aplication/repository/stage-repository";

interface AggregateModelRequest {
  Id: string; //Id from jwt
  modelId: string;
}

type AggregateModelResponse = Either<ResourceNotFoundError, { model: Model }>;
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
  }: AggregateModelRequest): Promise<AggregateModelResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const model = await this.modelRepository.findById(modelId);

    if (!model) {
      return left(new ResourceNotFoundError(Id));
    }

    const newModel = Model.create({
      adminId: Id,
      company: model.company,
      dateOfCreation: new Date(),
    });

    await this.modelRepository.create(newModel);

    const group = await this.groupRepository.findManyByModelId(
      model.id.toString(),
    );

    if (!group) {
      return left(new ResourceNotFoundError("nenhum grupo encontrado"));
    }

    const up = group.map((item)=>({
      ...item,
      modelId:newModel
    }))
    return right({ model });
  }
}
