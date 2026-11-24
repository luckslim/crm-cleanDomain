import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../repository/admin-repository";
import type { clientRepository } from "../../repository/client-repository";
import type { groupRepository } from "../../repository/group-repository";
import type { stageRepository } from "../../repository/stage-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { Record } from "@/domain/enterprise/record";
import type { recordRepository } from "../../repository/record-repository";

interface CreateRecordRequest {
  Id: string; // Id from Jwt
  clientId: string;
  groupId: string;
  stageId?: string; //optional
  interest?: string; //optional
  origin: string;
  propertyOfInterest: string;
  budget: string;
  nextContact: Date;
  period: string;
  tags: string;
  notes: string;
  color?: string;
}

type CreateRecordResponse = Either<ResourceNotFoundError, { message: string }>;
export class CreateRecordUseCase {
  constructor(
    public adminRepository: adminRepository,
    public clientRepository: clientRepository,
    public groupRepository: groupRepository,
    public stageRepository: stageRepository,
    public recordRepository: recordRepository,
  ) {}
  async execute({
    Id,
    clientId,
    groupId,
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
  }: CreateRecordRequest): Promise<CreateRecordResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError("admin not found"));
    }

    const client = await this.clientRepository.findById(clientId);

    if (!client) {
      return left(new ResourceNotFoundError("client not found"));
    }

    const group = await this.groupRepository.findById(groupId);

    if (!group) {
      return left(new ResourceNotFoundError("group not found"));
    }

    const stage = await this.stageRepository.findById(stageId);

    const record = Record.create({
      adminId: admin.id.toString(),
      clientId: client.id.toString(),
      groupId: group.id.toString(),
      stageId: stage?.id.toString() ?? null,
      interest: interest ?? null,
      origin,
      propertyOfInterest,
      budget,
      nextContact,
      period,
      tags,
      notes,
      color: color ?? null,
      dateOfCreation: new Date(),
    });

    await this.recordRepository.create(record);

    return right({ message: "Criado com sucesso!" });
  }
}
