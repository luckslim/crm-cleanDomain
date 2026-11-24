import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { recordRepository } from "../../repository/record-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface DeleteRecordRequest {
  Id: string; // Id from Jwt
  recordId: string;
}

type DeleteRecordResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { message: string }
>;
export class DeleteRecordUseCase {
  constructor(
    public adminRepository: adminRepository,
    public recordRepository: recordRepository,
  ) {}
  async execute({
    Id,
    recordId,
  }: DeleteRecordRequest): Promise<DeleteRecordResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError("admin not found"));
    }

    const record = await this.recordRepository.findById(recordId);

    if (!record) {
      return left(new ResourceNotFoundError("record not found"));
    }

    if (admin.id.toString() != record.adminId) {
      return left(
        new NotAllowedError("administrador e Record não autorizados"),
      );
    }

    await this.recordRepository.delete(record.id.toString());

    return right({ message: "Deletado com sucesso!" });
  }
}
