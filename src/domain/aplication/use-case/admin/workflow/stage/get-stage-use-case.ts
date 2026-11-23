import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { stageRepository } from "../../../../repository/stage-repository";
import type { Stage } from "@/domain/enterprise/stage";

interface GetStageRequest {
  Id: string; //id from jwt
  groupId: string;
}

type GetStageResponse = Either<ResourceNotFoundError, { stage: Stage[] }>;
export class GetStageUseCase {
  constructor(
    public stageRepository: stageRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({ Id, groupId }: GetStageRequest): Promise<GetStageResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const stage = await this.stageRepository.findManyByGroupId(groupId);

    if (!stage) {
      return left(new ResourceNotFoundError("etapas não encontradas"));
    }

    return right({ stage });
  }
}
