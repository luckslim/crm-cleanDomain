import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { MakeGroup } from "../../../../../../test/factory/make-group";
import { MakeModel } from "../../../../../../test/factory/make-model";
import { MakeStage } from "../../../../../../test/factory/make-stage";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryGroupRepository } from "../../../../../../test/in-memory-repository/in-memory-group-repository";
import { InMemoryModelRepository } from "../../../../../../test/in-memory-repository/in-memory-model-repository";
import { InMemoryStageRepository } from "../../../../../../test/in-memory-repository/in-memory-stage-repository";
import { AggregateModelUseCase } from "./aggregate-use-case";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

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

  it("copies the model, its groups, and their stages", async () => {
    const admin = MakeAdmin({});
    const sourceAdmin = MakeAdmin({});
    const model = MakeModel({ adminId: sourceAdmin.id.toString() });
    const buyerGroup = MakeGroup({
      modelId: model.id.toString(),
      type: "Buyer",
    });
    const sellerGroup = MakeGroup({
      modelId: model.id.toString(),
      type: "Seller",
    });
    const firstStage = MakeStage({
      groupId: buyerGroup.id.toString(),
      name: "Qualified",
    });
    const secondStage = MakeStage({
      groupId: buyerGroup.id.toString(),
      name: "Negotiation",
    });
    await adminRepository.create(sourceAdmin);
    await adminRepository.create(admin);
    await modelRepository.create(model);
    await groupRepository.create(buyerGroup);
    await groupRepository.create(sellerGroup);
    await stageRepository.create(firstStage);
    await stageRepository.create(secondStage);

    const result = await sut.execute({
      Id: admin.id.toString(),
      modelId: model.id.toString(),
      company: "Copied company",
    });

    expect(result.isRight()).toBe(true);
    if (!result.isRight()) {
      return;
    }

    const copiedModel = result.value.model;
    const copiedGroups = groupRepository.items.filter(
      (group) => group.modelId === copiedModel.id.toString(),
    );
    const copiedGroupIds = copiedGroups.map((group) => group.id.toString());
    const copiedStages = stageRepository.items.filter((stage) =>
      copiedGroupIds.includes(stage.groupId),
    );

    expect(modelRepository.items).toHaveLength(2);
    expect(copiedModel.company).toBe("Copied company");
    expect(copiedModel.adminId).toBe(admin.id.toString());
    expect(copiedGroups).toHaveLength(2);
    expect(copiedGroups.map((group) => group.type)).toEqual([
      "Buyer",
      "Seller",
    ]);
    expect(copiedGroups).not.toContain(buyerGroup);
    expect(copiedGroups).not.toContain(sellerGroup);
    expect(copiedStages.map((stage) => stage.name)).toEqual([
      "Qualified",
      "Negotiation",
    ]);
    expect(
      copiedStages.every((stage) => copiedGroupIds.includes(stage.groupId)),
    ).toBe(true);
  });

  it("uses the source company when no replacement company is provided", async () => {
    const admin = MakeAdmin({});
    const sourceAdmin = MakeAdmin({});
    const model = MakeModel({
      adminId: sourceAdmin.id.toString(),
      company: "Original company",
    });
    const group = MakeGroup({ modelId: model.id.toString() });
    await adminRepository.create(sourceAdmin);
    await adminRepository.create(admin);
    await modelRepository.create(model);
    await groupRepository.create(group);

    const result = await sut.execute({
      Id: admin.id.toString(),
      modelId: model.id.toString(),
      company: null,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.model.company).toBe("copy-Original company");
    }
  });
  
  it("returns not allowed when the admin have a model", async () => {
    const admin = MakeAdmin({});

    await adminRepository.create(admin);

    const model = MakeModel({ adminId: admin.id.toString() });

    await modelRepository.create(model);

    const result = await sut.execute({
      Id: admin.id.toString(),
      modelId: model.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({
      Id: "missing-admin",
      modelId: "model",
      company: null,
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
      company: null,
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("returns not found when the source model has no groups", async () => {
    const admin = MakeAdmin({});
    const sourceAdmin = MakeAdmin({});
    const model = MakeModel({ adminId: sourceAdmin.id.toString() });
    await adminRepository.create(sourceAdmin);
    await adminRepository.create(admin);
    await modelRepository.create(model);

    const result = await sut.execute({
      Id: admin.id.toString(),
      modelId: model.id.toString(),
      company: null,
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
