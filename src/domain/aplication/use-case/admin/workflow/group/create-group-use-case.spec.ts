import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../../../test/factory/make-admin";
import { MakeModel } from "../../../../../../../test/factory/make-model";
import { InMemoryAdminRepository } from "../../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryGroupRepository } from "../../../../../../../test/in-memory-repository/in-memory-group-repository";
import { InMemoryModelRepository } from "../../../../../../../test/in-memory-repository/in-memory-model-repository";
import { CreateGroupUseCase } from "./create-group-use-case";

describe("Create group", () => {
  let adminRepository: InMemoryAdminRepository;
  let groupRepository: InMemoryGroupRepository;
  let modelRepository: InMemoryModelRepository;
  let sut: CreateGroupUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    groupRepository = new InMemoryGroupRepository();
    modelRepository = new InMemoryModelRepository();
    sut = new CreateGroupUseCase(
      modelRepository,
      groupRepository,
      adminRepository,
    );
  });

  it("creates a group for the admin's model", async () => {
    const admin = MakeAdmin({});
    const model = MakeModel({ adminId: admin.id.toString() });
    await adminRepository.create(admin);
    await modelRepository.create(model);

    const result = await sut.execute({
      Id: admin.id.toString(),
      modelId: model.id.toString(),
      type: "Residential",
    });

    expect(result.isRight()).toBe(true);
    expect(groupRepository.items).toHaveLength(1);
    expect(groupRepository.items[0]?.modelId).toBe(model.id.toString());
    expect(groupRepository.items[0]?.type).toBe("Residential");
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({
      Id: "missing-admin",
      modelId: "model",
      type: "Residential",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("returns not found when the model does not exist", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({
      Id: admin.id.toString(),
      modelId: "missing-model",
      type: "Residential",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("rejects a model owned by another admin", async () => {
    const admin = MakeAdmin({});
    const model = MakeModel({ adminId: "another-admin" });
    await adminRepository.create(admin);
    await modelRepository.create(model);

    const result = await sut.execute({
      Id: admin.id.toString(),
      modelId: model.id.toString(),
      type: "Residential",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });
});
