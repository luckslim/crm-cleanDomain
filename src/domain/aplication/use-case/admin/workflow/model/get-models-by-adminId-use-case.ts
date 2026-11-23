import { left, right, type Either } from "@/core/either";
import { Model } from "@/domain/enterprise/model";
import type { modelRepository } from "../../../../repository/model-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { adminRepository } from "../../../../repository/admin-repository";

interface GetModelsRequest {
  Id: string; //Id from jwt
}

type GetModelsResponse = Either<ResourceNotFoundError, { model: Model[] }>;
export class GetModelsUseCase {
  constructor(
    public modelRepository: modelRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({ Id }: GetModelsRequest): Promise<GetModelsResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const model = await this.modelRepository.findManyByAdminId(
      admin.id.toString(),
    );

    if (!model) {
      return left(new ResourceNotFoundError(Id));
    }

    return right({ model });
  }
}
