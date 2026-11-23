import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../../../test/factory/make-admin";
import { MakeStage } from "../../../../../../../test/factory/make-stage";
import { InMemoryAdminRepository } from "../../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryStageRepository } from "../../../../../../../test/in-memory-repository/in-memory-stage-repository";
import { GetStageUseCase } from "./get-stage-use-case";

describe("Get stages", () => {
  let adminRepository: InMemoryAdminRepository;
  let stageRepository: InMemoryStageRepository;
  let sut: GetStageUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    stageRepository = new InMemoryStageRepository();
    sut = new GetStageUseCase(stageRepository, adminRepository);
  });

  it("returns stages for a group", async () => {
    const admin = MakeAdmin({});
    const stage = MakeStage({ groupId: "group-id" });
    await adminRepository.create(admin);
    await stageRepository.create(stage);

    const result = await sut.execute({
      Id: admin.id.toString(),
      groupId: "group-id",
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.stage).toEqual([stage]);
    }
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({
      Id: "missing-admin",
      groupId: "group-id",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("returns not found when the group has no stages", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({
      Id: admin.id.toString(),
      groupId: "empty-group",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
