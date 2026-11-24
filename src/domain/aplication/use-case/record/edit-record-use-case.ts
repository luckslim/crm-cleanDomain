import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../repository/admin-repository";
import type { groupRepository } from "../../repository/group-repository";
import type { stageRepository } from "../../repository/stage-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { recordRepository } from "../../repository/record-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface EditRecordRequest {
  Id: string; // Id from Jwt
  recordId: string;
  groupId: string;
  stageId?: string; //optional
  interest?: string; //optional
  origin: string;
  propertyOfInterest: string;
  budget: string;
  nextContact: Date;
  period: string;
  color?: string;
  tags: string;
  notes: string;
}

type EditRecordResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { message: string }
>;
export class EditRecordUseCase {
  constructor(
    public adminRepository: adminRepository,
    public groupRepository: groupRepository,
    public stageRepository: stageRepository,
    public recordRepository: recordRepository,
  ) {}
  async execute({
    Id,
    groupId,
    recordId,
    stageId,
    interest,
    origin,
    propertyOfInterest,
    budget,
    nextContact,
    period,
    tags,
    notes,
    color,
  }: EditRecordRequest): Promise<EditRecordResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError("admin not found"));
    }

    const record = await this.recordRepository.findById(recordId);

    if (!record) {
      return left(new ResourceNotFoundError("record not found"));
    }

    if (admin.id.toString() != record.adminId) {
      return left(new NotAllowedError("administrador e Record não autorizado"));
    }

    const group = await this.groupRepository.findById(groupId);

    if (!group) {
      return left(new ResourceNotFoundError("group not found"));
    }

    const stage = await this.stageRepository.findById(stageId);

    record.groupId = group.id.toString();
    record.stageId = stage?.id.toString() ?? null;
    record.interest = interest ?? null;
    record.origin = origin;
    record.propertyOfInterest = propertyOfInterest;
    record.budget = budget;
    record.nextContact = nextContact;
    record.period = period;
    record.tags = tags;
    record.notes = notes;
    record.color = color ?? null;

    await this.recordRepository.save(record);

    return right({ message: "Salvo com sucesso!" });
  }
}
