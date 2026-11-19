import { left, right, type Either } from "@/core/either";
import { EmailAlreadyExistError } from "@/core/errors/email-already-exist-error";
import type { HashGenerator } from "../../cryptography/hash-generator";
import type { clientRepository } from "../../repository/client-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { adminRepository } from "../../repository/admin-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface EditClientRequest {
  adminId: string; //Id from jwt
  clientId: string;
  clientName: string;
  email: string;
  urlImage: string;
  city: string;
  cep: number;
  street: string;
  state: string;
  number: number;
  cellphone: number;
}

type EditClientResponse = Either<
  EmailAlreadyExistError | ResourceNotFoundError,
  { message: string }
>;
export class EditClientUseCase {
  constructor(
    public clientRepository: clientRepository,
    public adminRepository: adminRepository,
    public hashGenerator: HashGenerator,
  ) {}
  async execute({
    adminId,
    clientId,
    clientName,
    email,
    urlImage,
    city,
    cep,
    street,
    state,
    number,
    cellphone,
  }: EditClientRequest): Promise<EditClientResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new ResourceNotFoundError(adminId));
    }

    const client = await this.clientRepository.findById(clientId);

    if (!client) {
      return left(new ResourceNotFoundError(clientId));
    }

    if (admin.id.toString() != client.adminId) {
      return left(new NotAllowedError("Cliente e Administrador incompatíveis"));
    }

    client.clientName = clientName;
    client.email = email;
    client.urlImage = urlImage;
    client.city = city;
    client.cep = cep;
    client.street = street;
    client.state = state;
    client.number = number;
    client.cellphone = cellphone;

    await this.clientRepository.save(client);

    return right({ message: "Seus Dados foram Alterados com sucesso!" });
  }
}
