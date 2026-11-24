import { left, right, type Either } from "@/core/either";
import { Model } from "@/domain/enterprise/model";
import type { modelRepository } from "../../../../repository/model-repository";
import type { adminRepository } from "../../../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface CreateModelRequest {
  Id: string;
  company: string;
}

type CreateModelResponse = Either<ResourceNotFoundError, { message: string }>;
export class CreateModelUseCase {
  constructor(
    public modelRepository: modelRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({
    Id,
    company,
  }: CreateModelRequest): Promise<CreateModelResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const modelExisting = await this.modelRepository.findByAdminId(Id);

    if (modelExisting) {
      return left(new NotAllowedError("há uma modelo em uso."));
    }

    const model = Model.create({
      adminId: Id,
      company,
      dateOfCreation: new Date(),
    });

    await this.modelRepository.create(model);

    return right({ message: "Sua modelo de trabalho foi criado com sucesso!" });
  }
}
