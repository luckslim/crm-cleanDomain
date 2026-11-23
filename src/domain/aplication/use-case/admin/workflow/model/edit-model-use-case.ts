import { left, right, type Either } from "@/core/either";
import type { modelRepository } from "../../../../repository/model-repository";
import type { adminRepository } from "../../../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface EditModelRequest {
  Id: string;
  modelId: string;
  company: string;
}

type EditModelResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { message: string }
>;
export class EditModelUseCase {
  constructor(
    public modelRepository: modelRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({
    Id,
    modelId,
    company,
  }: EditModelRequest): Promise<EditModelResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const model = await this.modelRepository.findById(modelId);

    if (!model) {
      return left(new ResourceNotFoundError("modelo não encontrado"));
    }

    if (model.adminId != admin.id.toString()) {
      return left(new NotAllowedError("modelo e administrador incompatíveis."));
    }

    model.company = company;

    await this.modelRepository.save(model);

    return right({ message: "Sua modelo de trabalho foi criado com sucesso!" });
  }
}
