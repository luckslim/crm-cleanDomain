import { left, right, type Either } from "@/core/either";
import { EmailAlreadyExistError } from "@/core/errors/email-already-exist-error";
import { Model } from "@/domain/enterprise/model";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { modelRepository } from "@/domain/aplication/repository/model-repository";
import type { adminRepository } from "@/domain/aplication/repository/admin-repository";

interface GetModelRequest {
  Id: string; //Id from jwt
  modelId: string;
}

type GetModelResponse = Either<EmailAlreadyExistError, { model: Model }>;
export class GetModelUseCase {
  constructor(
    public modelRepository: modelRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({ Id, modelId }: GetModelRequest): Promise<GetModelResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const model = await this.modelRepository.findById(modelId);

    if (!model) {
      return left(new ResourceNotFoundError(Id));
    }

    return right({ model });
  }
}
