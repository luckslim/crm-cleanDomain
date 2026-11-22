import { left, right, type Either } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { adminRepository } from "../../repository/admin-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import type { clientRepository } from "../../repository/client-repository";

interface DeleteClientRequest {
  Id: string; //id from jwt
  clientId: string;
}

type DeleteClientResponse = Either<ResourceNotFoundError | NotAllowedError, { message: string }>;
export class DeleteClientUseCase {
  constructor(
    public clientRepository: clientRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({
    Id,
    clientId,
  }: DeleteClientRequest): Promise<DeleteClientResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const client = await this.clientRepository.findById(clientId);

    if (!client) {
      return left(new ResourceNotFoundError(clientId));
    }

    if (client.adminId != admin.id.toString()) {
      return left(new NotAllowedError(admin.id.toString()));
    }

    await this.clientRepository.delete(client.id.toString());

    return right({ message: "Conta cancelada com sucesso!" });
  }
}
