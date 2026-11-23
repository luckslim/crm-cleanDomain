import { left, right, type Either } from "@/core/either";
import type { timeRepository } from "../../repository/time-repository";
import type { adminRepository } from "../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { Time } from "@/domain/enterprise/time";

interface CreateTimeRequest {
  Id: string; // id from jwt
  time: string;
}

type CreateTimeResponse = Either<ResourceNotFoundError, { message: string }>;
export class CreateTimeUseCase {
  constructor(
    public timeRepository: timeRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({ Id, time }: CreateTimeRequest): Promise<CreateTimeResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const data = Time.create({
      adminId: admin.id.toString(),
      time,
      dateOfCreation: new Date(),
    });

    await this.timeRepository.create(data);

    return right({ message: "Horário criado com sucesso!" });
  }
}
