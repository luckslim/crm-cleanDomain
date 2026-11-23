import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../../../test/factory/make-admin";
import { MakeGroup } from "../../../../../../../test/factory/make-group";
import { MakeModel } from "../../../../../../../test/factory/make-model";
import { MakeStage } from "../../../../../../../test/factory/make-stage";
import { InMemoryAdminRepository } from "../../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryGroupRepository } from "../../../../../../../test/in-memory-repository/in-memory-group-repository";
import { InMemoryModelRepository } from "../../../../../../../test/in-memory-repository/in-memory-model-repository";
import { InMemoryStageRepository } from "../../../../../../../test/in-memory-repository/in-memory-stage-repository";
import { EditStageUseCase } from "./edit-stage-use-case";

describe("Edit stage", () => {
  let adminRepository: InMemoryAdminRepository;
  let groupRepository: InMemoryGroupRepository;
  let modelRepository: InMemoryModelRepository;
  let stageRepository: InMemoryStageRepository;
  let sut: EditStageUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    groupRepository = new InMemoryGroupRepository();
    modelRepository = new InMemoryModelRepository();
    stageRepository = new InMemoryStageRepository();
    sut = new EditStageUseCase(
      modelRepository,
      groupRepository,
      stageRepository,
      adminRepository,
    );
  });

  it("updates a stage owned by the admin", async () => {
    const admin = MakeAdmin({});
    const model = MakeModel({ adminId: admin.id.toString() });
    const group = MakeGroup({ modelId: model.id.toString() });
    const stage = MakeStage({ groupId: group.id.toString() });
    await adminRepository.create(admin);
    await modelRepository.create(model);
    await groupRepository.create(group);
    await stageRepository.create(stage);

    const result = await sut.execute({
      Id: admin.id.toString(),
      stageId: stage.id.toString(),
      name: "Qualified",
    });

    expect(result.isRight()).toBe(true);
    expect(stageRepository.items[0]?.name).toBe("Qualified");
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({
      Id: "missing-admin",
      stageId: "stage",
      name: "Qualified",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("returns not found when the stage does not exist", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({
      Id: admin.id.toString(),
      stageId: "missing-stage",
      name: "Qualified",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("rejects a stage whose group model belongs to another admin", async () => {
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
      name: "Qualified",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });
});
