import { left, right, type Either } from "@/core/either";
import { EmailAlreadyExistError } from "@/core/errors/email-already-exist-error";
import type { timeRepository } from "../../repository/time-repository";
import type { adminRepository } from "../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface DeleteTimeRequest {
  Id: string; // id from jwt
  timeId: string;
}

type DeleteTimeResponse = Either<EmailAlreadyExistError, { message: string }>;
export class DeleteTimeUseCase {
  constructor(
    public timeRepository: timeRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({
    Id,
    timeId,
  }: DeleteTimeRequest): Promise<DeleteTimeResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const time = await this.timeRepository.findById(timeId);

    if (!time) {
      return left(new ResourceNotFoundError(timeId));
    }

    await this.timeRepository.delete(timeId);

    return right({ message: "Horário deletado com sucesso!" });
  }
}
