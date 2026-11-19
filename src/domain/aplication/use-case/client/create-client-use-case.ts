import { left, right, type Either } from "@/core/either";
import { EmailAlreadyExistError } from "@/core/errors/email-already-exist-error";
import { Client } from "@/domain/enterprise/client";
import type { HashGenerator } from "../../cryptography/hash-generator";
import type { clientRepository } from "../../repository/client-repository";
import type { adminRepository } from "../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface CreateClientRequest {
  adminId: string;
  clientName: string;
  email: string;
  urlImage: string;
  city: string;
  cep: number;
  street: string;
  state: string;
  number: number;
  cellphone: number;
  dateOfCreation: Date;
}

type CreateClientResponse = Either<ResourceNotFoundError, { message: string }>;
export class CreateClientUseCase {
  constructor(
    public clientRepository: clientRepository,
    public adminRepository: adminRepository,
    public hashGenerator: HashGenerator,
  ) {}
  async execute({
    adminId,
    clientName,
    email,
    urlImage,
    city,
    cep,
    street,
    state,
    number,
    cellphone,
    dateOfCreation,
  }: CreateClientRequest): Promise<CreateClientResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new ResourceNotFoundError(adminId));
    }

    const client = Client.create({
      adminId,
      clientName,
      email,
      urlImage,
      city,
      cep,
      street,
      state,
      number,
      cellphone,
      dateOfCreation,
    });

    await this.clientRepository.create(client);

    return right({ message: "Sua conta foi criada com sucesso!" });
  }
}
