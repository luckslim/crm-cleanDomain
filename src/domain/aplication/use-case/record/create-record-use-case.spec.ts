import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { MakeClient } from "../../../../../test/factory/make-client";
import { MakeGroup } from "../../../../../test/factory/make-group";
import { MakeStage } from "../../../../../test/factory/make-stage";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryClientRepository } from "../../../../../test/in-memory-repository/in-memory-client-repository";
import { InMemoryGroupRepository } from "../../../../../test/in-memory-repository/in-memory-group-repository";
import { InMemoryRecordRepository } from "../../../../../test/in-memory-repository/in-memory-record-repository";
import { InMemoryStageRepository } from "../../../../../test/in-memory-repository/in-memory-stage-repository";
import { CreateRecordUseCase } from "./create-record-use-case";

describe("Create record", () => {
  let adminRepository: InMemoryAdminRepository;
  let clientRepository: InMemoryClientRepository;
  let groupRepository: InMemoryGroupRepository;
  let recordRepository: InMemoryRecordRepository;
  let stageRepository: InMemoryStageRepository;
  let sut: CreateRecordUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    clientRepository = new InMemoryClientRepository();
    groupRepository = new InMemoryGroupRepository();
    recordRepository = new InMemoryRecordRepository();
    stageRepository = new InMemoryStageRepository();
    sut = new CreateRecordUseCase(
      adminRepository,
      clientRepository,
      groupRepository,
      stageRepository,
      recordRepository,
    );
  });

  it("creates a record with its client, group, stage, and optional values", async () => {
    const admin = MakeAdmin({});
    const client = MakeClient({ adminId: admin.id.toString() });
    const group = MakeGroup({});
    const stage = MakeStage({ groupId: group.id.toString() });
    const nextContact = new Date("2026-12-01T10:00:00.000Z");
    await adminRepository.create(admin);
    await clientRepository.create(client);
    await groupRepository.create(group);
    await stageRepository.create(stage);

    const result = await sut.execute({
      Id: admin.id.toString(),
      clientId: client.id.toString(),
      groupId: group.id.toString(),
      stageId: stage.id.toString(),
      interest: "buy",
      origin: "website",
      propertyOfInterest: "Apartment",
      budget: "500000",
      nextContact,
      period: "morning",
      tags: "priority",
      notes: "Follow up",
      color: "#112233",
    });

    expect(result.isRight()).toBe(true);
    expect(recordRepository.items).toHaveLength(1);
    expect(recordRepository.items[0]).toMatchObject({
      adminId: admin.id.toString(),
      clientId: client.id.toString(),
      groupId: group.id.toString(),
      stageId: stage.id.toString(),
      interest: "buy",
      origin: "website",
      propertyOfInterest: "Apartment",
      budget: "500000",
      nextContact,
      period: "morning",
      tags: "priority",
      notes: "Follow up",
      color: "#112233",
    });
  });

  it("creates a record without optional stage and interest values", async () => {
    const admin = MakeAdmin({});
    const client = MakeClient({});
    const group = MakeGroup({});
    await adminRepository.create(admin);
    await clientRepository.create(client);
    await groupRepository.create(group);

    const result = await sut.execute({
      Id: admin.id.toString(),
      clientId: client.id.toString(),
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

  it.each([
    ["admin", "missing-admin"],
    ["client", "missing-client"],
    ["group", "missing-group"],
  ])("returns not found when the %s does not exist", async (missing, id) => {
    const admin = MakeAdmin({});
    const client = MakeClient({});
    const group = MakeGroup({});
    if (missing !== "admin") await adminRepository.create(admin);
    if (missing !== "client") await clientRepository.create(client);
    if (missing !== "group") await groupRepository.create(group);

    const result = await sut.execute({
      Id: missing === "admin" ? id : admin.id.toString(),
      clientId: missing === "client" ? id : client.id.toString(),
      groupId: missing === "group" ? id : group.id.toString(),
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
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
    expect(recordRepository.items).toHaveLength(0);
  });
});
