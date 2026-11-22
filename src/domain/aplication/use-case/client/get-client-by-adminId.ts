import { left, right, type Either } from "@/core/either";
import { EmailAlreadyExistError } from "@/core/errors/email-already-exist-error";
import { Client } from "@/domain/enterprise/client";
import type { clientRepository } from "../../repository/client-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { adminRepository } from "../../repository/admin-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface GetClientRequest {
  Id: string; //Id from jwt
  clientId: string;
}

type GetClientResponse = Either<EmailAlreadyExistError, { client: Client }>;
export class GetClientUseCase {
  constructor(
    public clientRepository: clientRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({
    Id,
    clientId,
  }: GetClientRequest): Promise<GetClientResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const client = await this.clientRepository.findById(clientId);

    if (!client) {
      return left(new ResourceNotFoundError(Id));
    }

    if (admin.id.toString() != client.adminId) {
      return left(new NotAllowedError("administrador e cliente"));
    }

    return right({ client });
  }
}
