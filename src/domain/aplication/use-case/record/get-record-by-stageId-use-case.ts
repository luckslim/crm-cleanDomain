import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { recordRepository } from "../../repository/record-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import type { Record } from "@/domain/enterprise/record";
import type { stageRepository } from "../../repository/stage-repository";
import type { groupRepository } from "../../repository/group-repository";
import type { modelRepository } from "../../repository/model-repository";

interface GetRecordByStageRecordRequest {
  Id: string; // Id from Jwt
  stageId: string;
}

type GetRecordByStageRecordResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { record: Record[] }
>;
export class GetRecordByStageRecordUseCase {
  constructor(
    public adminRepository: adminRepository,
    public stageRepository: stageRepository,
    public groupRepository: groupRepository,
    public modelRepository: modelRepository,
    public recordRepository: recordRepository,
  ) {}
  async execute({
    Id,
    stageId,
  }: GetRecordByStageRecordRequest): Promise<GetRecordByStageRecordResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError("admin not found"));
    }

    const stage = await this.stageRepository.findById(stageId);

    if (!stage) {
      return left(new ResourceNotFoundError("stage not found"));
    }

    const group = await this.groupRepository.findById(stage.groupId);

    if (!group) {
      return left(new ResourceNotFoundError("group not found"));
    }

    const model = await this.modelRepository.findById(group.modelId);

    if (!model) {
      return left(new ResourceNotFoundError("model not found"));
    }

    if (admin.id.toString() != model.adminId) {
      return left(new NotAllowedError("administrador não autorizado"));
    }

    const record = await this.recordRepository.findManyByStageId(stageId);

    if (!record) {
      return left(new ResourceNotFoundError("record not found"));
    }

    return right({ record });
  }
}
