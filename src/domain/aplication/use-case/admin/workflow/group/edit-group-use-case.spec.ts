import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../../../test/factory/make-admin";
import { MakeGroup } from "../../../../../../../test/factory/make-group";
import { MakeModel } from "../../../../../../../test/factory/make-model";
import { InMemoryAdminRepository } from "../../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryGroupRepository } from "../../../../../../../test/in-memory-repository/in-memory-group-repository";
import { InMemoryModelRepository } from "../../../../../../../test/in-memory-repository/in-memory-model-repository";
import { EditGroupUseCase } from "./edit-group-use-case";

describe("Edit group", () => {
  let adminRepository: InMemoryAdminRepository;
  let groupRepository: InMemoryGroupRepository;
  let modelRepository: InMemoryModelRepository;
  let sut: EditGroupUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    groupRepository = new InMemoryGroupRepository();
    modelRepository = new InMemoryModelRepository();
    sut = new EditGroupUseCase(
      groupRepository,
      adminRepository,
      modelRepository,
    );
  });

  it("updates a group owned by the admin", async () => {
    const admin = MakeAdmin({});
    const model = MakeModel({ adminId: admin.id.toString() });
    const group = MakeGroup({ modelId: model.id.toString() });
    await adminRepository.create(admin);
    await modelRepository.create(model);
    await groupRepository.create(group);

    const result = await sut.execute({
      Id: admin.id.toString(),
      groupId: group.id.toString(),
      type: "Commercial",
    });

    expect(result.isRight()).toBe(true);
    expect(groupRepository.items[0]?.type).toBe("Commercial");
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({
      Id: "missing-admin",
      groupId: "group",
      type: "Commercial",
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
      type: "Commercial",
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
      type: "Commercial",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });
});
