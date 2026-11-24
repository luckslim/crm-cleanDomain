import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { MakeGroup } from "../../../../../test/factory/make-group";
import { MakeRecord } from "../../../../../test/factory/make-record";
import { MakeStage } from "../../../../../test/factory/make-stage";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryGroupRepository } from "../../../../../test/in-memory-repository/in-memory-group-repository";
import { InMemoryRecordRepository } from "../../../../../test/in-memory-repository/in-memory-record-repository";
import { InMemoryStageRepository } from "../../../../../test/in-memory-repository/in-memory-stage-repository";
import { EditRecordUseCase } from "./edit-record-use-case";

describe("Edit record", () => {
  let adminRepository: InMemoryAdminRepository;
  let groupRepository: InMemoryGroupRepository;
  let recordRepository: InMemoryRecordRepository;
  let stageRepository: InMemoryStageRepository;
  let sut: EditRecordUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    groupRepository = new InMemoryGroupRepository();
    recordRepository = new InMemoryRecordRepository();
    stageRepository = new InMemoryStageRepository();
    sut = new EditRecordUseCase(
      adminRepository,
      groupRepository,
      stageRepository,
      recordRepository,
    );
  });

  it("updates the record fields and stage", async () => {
    const admin = MakeAdmin({});
    const group = MakeGroup({});
    const stage = MakeStage({ groupId: group.id.toString() });
    const record = MakeRecord({
      adminId: admin.id.toString(),
      groupId: "old-group",
    });
    const nextContact = new Date("2026-12-02T12:00:00.000Z");
    await adminRepository.create(admin);
    await groupRepository.create(group);
    await stageRepository.create(stage);
    await recordRepository.create(record);

    const result = await sut.execute({
      Id: admin.id.toString(),
      recordId: record.id.toString(),
      groupId: group.id.toString(),
      stageId: stage.id.toString(),
      interest: "sell",
      origin: "referral",
      propertyOfInterest: "House",
      budget: "800000",
      nextContact,
      period: "afternoon",
      color: "#445566",
      tags: "follow-up",
      notes: "Updated notes",
    });

    expect(result.isRight()).toBe(true);
    expect(recordRepository.items[0]).toMatchObject({
      groupId: group.id.toString(),
      stageId: stage.id.toString(),
      interest: "sell",
      origin: "referral",
      propertyOfInterest: "House",
      budget: "800000",
      nextContact,
      period: "afternoon",
      color: "#445566",
      tags: "follow-up",
      notes: "Updated notes",
    });
  });

  it("clears optional stage, interest, and color when omitted", async () => {
    const admin = MakeAdmin({});
    const group = MakeGroup({});
    const record = MakeRecord({
      adminId: admin.id.toString(),
      stageId: "old-stage",
      interest: "old-interest",
      color: "red",
    });
    await adminRepository.create(admin);
    await groupRepository.create(group);
    await recordRepository.create(record);

    const result = await sut.execute({
      Id: admin.id.toString(),
      recordId: record.id.toString(),
      groupId: group.id.toString(),
      origin: "website",
      propertyOfInterest: "Apartment",
      budget: "500000",
      nextContact: new Date(),
      period: "morning",
      tags: "",
      notes: "",
    });

    expect(result.isRight()).toBe(true);
    expect(recordRepository.items[0]?.stageId).toBeNull();
    expect(recordRepository.items[0]?.interest).toBeNull();
    expect(recordRepository.items[0]?.color).toBeNull();
  });

  it("returns not found when the admin, record, or group does not exist", async () => {
    const request = {
      recordId: "record",
      groupId: "group",
      origin: "website",
      propertyOfInterest: "Apartment",
      budget: "500000",
      nextContact: new Date(),
      period: "morning",
      tags: "",
      notes: "",
    };

    const missingAdmin = await sut.execute({
      ...request,
      Id: "missing-admin",
    });
    expect(missingAdmin.isLeft()).toBe(true);
    if (missingAdmin.isLeft()) {
      expect(missingAdmin.value).toBeInstanceOf(ResourceNotFoundError);
    }

    const admin = MakeAdmin({});
    await adminRepository.create(admin);
    const missingRecord = await sut.execute({
      ...request,
      Id: admin.id.toString(),
    });
    expect(missingRecord.isLeft()).toBe(true);
    if (missingRecord.isLeft()) {
      expect(missingRecord.value).toBeInstanceOf(ResourceNotFoundError);
    }

    const record = MakeRecord({ adminId: admin.id.toString() });
    await recordRepository.create(record);
    const missingGroup = await sut.execute({
      ...request,
      Id: admin.id.toString(),
      recordId: record.id.toString(),
    });
    expect(missingGroup.isLeft()).toBe(true);
    if (missingGroup.isLeft()) {
      expect(missingGroup.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("rejects a record owned by another admin", async () => {
    const admin = MakeAdmin({});
    const record = MakeRecord({ adminId: "another-admin" });
    await adminRepository.create(admin);
    await recordRepository.create(record);

    const result = await sut.execute({
      Id: admin.id.toString(),
      recordId: record.id.toString(),
      groupId: "group",
      origin: "website",
      propertyOfInterest: "Apartment",
      budget: "500000",
      nextContact: new Date(),
      period: "morning",
      tags: "",
      notes: "",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });
});
