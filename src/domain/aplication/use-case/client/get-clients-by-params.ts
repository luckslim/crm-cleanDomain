import { left, right, type Either } from "@/core/either";
import { EmailAlreadyExistError } from "@/core/errors/email-already-exist-error";
import { Client } from "@/domain/enterprise/client";
import type {
  ClientParams,
  clientRepository,
} from "../../repository/client-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { adminRepository } from "../../repository/admin-repository";

interface GetClientByParamsRequest {
  Id: string; //Id from jwt
  clientName?: string;
  cellphone?: number;
}

type GetClientByParamsResponse = Either<
  EmailAlreadyExistError,
  { clients: Client[] }
>;
export class GetClientUseCase {
  constructor(
    public clientRepository: clientRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({
    Id,
    clientName,
    cellphone,
  }: GetClientByParamsRequest): Promise<GetClientByParamsResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const param: ClientParams = {
      Id: admin.id.toString(),
      ...(clientName !== undefined ? { clientName } : {}),
      ...(cellphone !== undefined ? { cellphone } : {}),
    };

    const clients = await this.clientRepository.findByParams(param);

    if (!clients) {
      return left(new ResourceNotFoundError("Não Encontramos Clientes"));
    }

    return right({ clients });
  }
}
