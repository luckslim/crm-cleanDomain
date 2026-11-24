import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { MakeGroup } from "../../../../../test/factory/make-group";
import { MakeModel } from "../../../../../test/factory/make-model";
import { MakeRecord } from "../../../../../test/factory/make-record";
import { MakeStage } from "../../../../../test/factory/make-stage";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryGroupRepository } from "../../../../../test/in-memory-repository/in-memory-group-repository";
import { InMemoryModelRepository } from "../../../../../test/in-memory-repository/in-memory-model-repository";
import { InMemoryRecordRepository } from "../../../../../test/in-memory-repository/in-memory-record-repository";
import { InMemoryStageRepository } from "../../../../../test/in-memory-repository/in-memory-stage-repository";
import { GetRecordByStageRecordUseCase } from "./get-record-by-stageId-use-case";

describe("Get records by stage ID", () => {
  let adminRepository: InMemoryAdminRepository;
  let groupRepository: InMemoryGroupRepository;
  let modelRepository: InMemoryModelRepository;
  let recordRepository: InMemoryRecordRepository;
  let stageRepository: InMemoryStageRepository;
  let sut: GetRecordByStageRecordUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    groupRepository = new InMemoryGroupRepository();
    modelRepository = new InMemoryModelRepository();
    recordRepository = new InMemoryRecordRepository();
    stageRepository = new InMemoryStageRepository();
    sut = new GetRecordByStageRecordUseCase(
      adminRepository,
      stageRepository,
      groupRepository,
      modelRepository,
      recordRepository,
    );
  });

  it("returns records in a stage belonging to the admin", async () => {
    const admin = MakeAdmin({});
    const model = MakeModel({ adminId: admin.id.toString() });
    const group = MakeGroup({ modelId: model.id.toString() });
    const stage = MakeStage({ groupId: group.id.toString() });
    const records = [
      MakeRecord({
        adminId: admin.id.toString(),
        groupId: group.id.toString(),
        stageId: stage.id.toString(),
      }),
      MakeRecord({
        adminId: admin.id.toString(),
        groupId: group.id.toString(),
        stageId: stage.id.toString(),
      }),
    ];
    await adminRepository.create(admin);
    await modelRepository.create(model);
    await groupRepository.create(group);
    await stageRepository.create(stage);
    for (const record of records) await recordRepository.create(record);

    const result = await sut.execute({
      Id: admin.id.toString(),
      stageId: stage.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.record).toEqual(records);
    }
  });

  it("returns not found when admin, stage, group, model, or records are missing", async () => {
    const missingAdmin = await sut.execute({
      Id: "missing-admin",
      stageId: "stage",
    });
    expect(missingAdmin.isLeft()).toBe(true);
    if (missingAdmin.isLeft()) {
      expect(missingAdmin.value).toBeInstanceOf(ResourceNotFoundError);
    }

    const admin = MakeAdmin({});
    await adminRepository.create(admin);
    const missingStage = await sut.execute({
      Id: admin.id.toString(),
      stageId: "missing-stage",
    });
    expect(missingStage.isLeft()).toBe(true);
    if (missingStage.isLeft()) {
      expect(missingStage.value).toBeInstanceOf(ResourceNotFoundError);
    }

    const stageWithoutGroup = MakeStage({ groupId: "missing-group" });
    await stageRepository.create(stageWithoutGroup);
    const missingGroup = await sut.execute({
      Id: admin.id.toString(),
      stageId: stageWithoutGroup.id.toString(),
    });
    expect(missingGroup.isLeft()).toBe(true);
    if (missingGroup.isLeft()) {
      expect(missingGroup.value).toBeInstanceOf(ResourceNotFoundError);
    }

    const groupWithoutModel = MakeGroup({ modelId: "missing-model" });
    const stageWithoutModel = MakeStage({
      groupId: groupWithoutModel.id.toString(),
    });
    await groupRepository.create(groupWithoutModel);
    await stageRepository.create(stageWithoutModel);
    const missingModel = await sut.execute({
      Id: admin.id.toString(),
      stageId: stageWithoutModel.id.toString(),
    });
    expect(missingModel.isLeft()).toBe(true);
    if (missingModel.isLeft()) {
      expect(missingModel.value).toBeInstanceOf(ResourceNotFoundError);
    }

    const model = MakeModel({ adminId: admin.id.toString() });
    const group = MakeGroup({ modelId: model.id.toString() });
    const stageWithoutRecords = MakeStage({
      groupId: group.id.toString(),
    });
    await modelRepository.create(model);
    await groupRepository.create(group);
    await stageRepository.create(stageWithoutRecords);
    const missingRecords = await sut.execute({
      Id: admin.id.toString(),
      stageId: stageWithoutRecords.id.toString(),
    });
    expect(missingRecords.isLeft()).toBe(true);
    if (missingRecords.isLeft()) {
      expect(missingRecords.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("rejects a stage whose model belongs to another admin", async () => {
    const admin = MakeAdmin({});
    const model = MakeModel({ adminId: "another-admin" });
    const group = MakeGroup({ modelId: model.id.toString() });
    const stage = MakeStage({ groupId: group.id.toString() });
    await adminRepository.create(admin);
    await modelRepository.create(model);
    await groupRepository.create(group);
    await stageRepository.create(stage);

    const result = await sut.execute({
      Id: admin.id.toString(),
      stageId: stage.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });
});
