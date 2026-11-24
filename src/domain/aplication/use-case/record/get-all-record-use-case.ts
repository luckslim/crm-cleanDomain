import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { recordRepository } from "../../repository/record-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import type { Record } from "@/domain/enterprise/record";

interface GetAllRecordRequest {
  Id: string; // Id from Jwt
}

type GetAllRecordResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { record: Record[] }
>;
export class GetAllRecordUseCase {
  constructor(
    public adminRepository: adminRepository,
    public recordRepository: recordRepository,
  ) {}
  async execute({ Id }: GetAllRecordRequest): Promise<GetAllRecordResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError("admin not found"));
    }

    const record = await this.recordRepository.findManyById(
      admin.id.toString(),
    );

    if (!record) {
      return left(new ResourceNotFoundError("record not found"));
    }

    return right({ record });
  }
}
