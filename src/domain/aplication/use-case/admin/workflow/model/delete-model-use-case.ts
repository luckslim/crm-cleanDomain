import { left, right, type Either } from "@/core/either";
import type { modelRepository } from "../../../../repository/model-repository";
import type { adminRepository } from "../../../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface DeleteModelRequest {
  Id: string; // id from jwt
  modelId: string;
}

type DeleteModelResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { message: string }
>;
export class DeleteModelUseCase {
  constructor(
    public modelRepository: modelRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({
    Id,
    modelId,
  }: DeleteModelRequest): Promise<DeleteModelResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const model = await this.modelRepository.findById(modelId);

    if (!model) {
      return left(new ResourceNotFoundError("model não encontrado"));
    }

    if (model.adminId != admin.id.toString()) {
      return left(new NotAllowedError("modelo e administrador incompatíveis"));
    }

    await this.modelRepository.delete(model.id.toString());

    return right({ message: "Modelo de trabalho deletado com sucesso!" });
  }
}
