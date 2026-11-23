import { left, right, type Either } from "@/core/either";
import { Model } from "@/domain/enterprise/model";
import type { modelRepository } from "../../../../repository/model-repository";
import type { adminRepository } from "../../../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface CreateModelRequest {
  adminId: string;
  company: string;
}

type CreateModelResponse = Either<ResourceNotFoundError, { message: string }>;
export class CreateModelUseCase {
  constructor(
    public modelRepository: modelRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({
    adminId,
    company,
  }: CreateModelRequest): Promise<CreateModelResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new ResourceNotFoundError(adminId));
    }

    const model = Model.create({
      adminId,
      company,
      dateOfCreation: new Date(),
    });

    await this.modelRepository.create(model);

    return right({ message: "Sua modelo de trabalho foi criado com sucesso!" });
  }
}
