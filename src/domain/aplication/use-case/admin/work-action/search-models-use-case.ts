import { left, right, type Either } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { adminRepository } from "@/domain/aplication/repository/admin-repository";
import type { modelRepository } from "@/domain/aplication/repository/model-repository";
import type { Model } from "@/domain/enterprise/model";

interface SearchModelsRequest {
  Id: string; //Id from jwt
  company: string;
}

type SearchModelsResponse = Either<
  ResourceNotFoundError,
  { models: Model[] }
>;
export class SearchModelsUseCase {
  constructor(
    public modelRepository: modelRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({
    Id,
    company,
  }: SearchModelsRequest): Promise<SearchModelsResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError("administrador não encontrado"));
    }

    const models = await this.modelRepository.findManyByCompany(company);

    if (!models) {
      return left(new ResourceNotFoundError("Nenhum modelo encontrado."));
    }

    return right({ models });
  }
}
