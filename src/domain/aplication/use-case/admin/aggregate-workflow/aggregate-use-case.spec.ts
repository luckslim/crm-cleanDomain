import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { MakeGroup } from "../../../../../../test/factory/make-group";
import { MakeModel } from "../../../../../../test/factory/make-model";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryGroupRepository } from "../../../../../../test/in-memory-repository/in-memory-group-repository";
import { InMemoryModelRepository } from "../../../../../../test/in-memory-repository/in-memory-model-repository";
import { InMemoryStageRepository } from "../../../../../../test/in-memory-repository/in-memory-stage-repository";
import { AggregateModelUseCase } from "./aggregate-use-case";

describe("Aggregate model", () => {
  let adminRepository: InMemoryAdminRepository;
  let groupRepository: InMemoryGroupRepository;
  let modelRepository: InMemoryModelRepository;
  let stageRepository: InMemoryStageRepository;
  let sut: AggregateModelUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    groupRepository = new InMemoryGroupRepository();
    modelRepository = new InMemoryModelRepository();
    stageRepository = new InMemoryStageRepository();
    sut = new AggregateModelUseCase(
      modelRepository,
      adminRepository,
      groupRepository,
      stageRepository,
    );
  });

  it("creates an aggregate model when the source has groups", async () => {
    const admin = MakeAdmin({});
    const model = MakeModel({ adminId: admin.id.toString() });
    const group = MakeGroup({ modelId: model.id.toString() });
    await adminRepository.create(admin);
    await modelRepository.create(model);
    await groupRepository.create(group);

    const result = await sut.execute({
      Id: admin.id.toString(),
      modelId: model.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(modelRepository.items).toHaveLength(2);
    expect(modelRepository.items[1]?.company).toBe(model.company);
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({
      Id: "missing-admin",
      modelId: "model",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("returns not found when the source model does not exist", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({
      Id: admin.id.toString(),
      modelId: "missing-model",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("returns not found when the source model has no groups", async () => {
    const admin = MakeAdmin({});
    const model = MakeModel({ adminId: admin.id.toString() });
    await adminRepository.create(admin);
    await modelRepository.create(model);

    const result = await sut.execute({
      Id: admin.id.toString(),
      modelId: model.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
