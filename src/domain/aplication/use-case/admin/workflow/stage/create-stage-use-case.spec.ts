import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../../../test/factory/make-admin";
import { MakeGroup } from "../../../../../../../test/factory/make-group";
import { MakeModel } from "../../../../../../../test/factory/make-model";
import { InMemoryAdminRepository } from "../../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryGroupRepository } from "../../../../../../../test/in-memory-repository/in-memory-group-repository";
import { InMemoryModelRepository } from "../../../../../../../test/in-memory-repository/in-memory-model-repository";
import { InMemoryStageRepository } from "../../../../../../../test/in-memory-repository/in-memory-stage-repository";
import { CreateStageUseCase } from "./create-stage-use-case";

describe("Create stage", () => {
  let adminRepository: InMemoryAdminRepository;
  let groupRepository: InMemoryGroupRepository;
  let modelRepository: InMemoryModelRepository;
  let stageRepository: InMemoryStageRepository;
  let sut: CreateStageUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    groupRepository = new InMemoryGroupRepository();
    modelRepository = new InMemoryModelRepository();
    stageRepository = new InMemoryStageRepository();
    sut = new CreateStageUseCase(
      modelRepository,
      groupRepository,
      stageRepository,
      adminRepository,
    );
  });

  it("creates a stage in a group owned by the admin", async () => {
    const admin = MakeAdmin({});
    const model = MakeModel({ adminId: admin.id.toString() });
    const group = MakeGroup({ modelId: model.id.toString() });
    await adminRepository.create(admin);
    await modelRepository.create(model);
    await groupRepository.create(group);

    const result = await sut.execute({
      Id: admin.id.toString(),
      groupId: group.id.toString(),
      name: "Qualified",
    });

    expect(result.isRight()).toBe(true);
    expect(stageRepository.items).toHaveLength(1);
    expect(stageRepository.items[0]?.groupId).toBe(group.id.toString());
    expect(stageRepository.items[0]?.name).toBe("Qualified");
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({
      Id: "missing-admin",
      groupId: "group",
      name: "Qualified",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("returns not found when the group does not exist", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({
      Id: admin.id.toString(),
      groupId: "missing-group",
      name: "Qualified",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("rejects a group whose model belongs to another admin", async () => {
    const admin = MakeAdmin({});
    const model = MakeModel({ adminId: "another-admin" });
    const group = MakeGroup({ modelId: model.id.toString() });
    await adminRepository.create(admin);
    await modelRepository.create(model);
    await groupRepository.create(group);

    const result = await sut.execute({
      Id: admin.id.toString(),
      groupId: group.id.toString(),
      name: "Qualified",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });
});
