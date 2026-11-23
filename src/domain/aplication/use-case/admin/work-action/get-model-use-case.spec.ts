import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { MakeModel } from "../../../../../../test/factory/make-model";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryModelRepository } from "../../../../../../test/in-memory-repository/in-memory-model-repository";
import { GetModelUseCase } from "./get-model-use-case";

describe("Get model", () => {
  let adminRepository: InMemoryAdminRepository;
  let modelRepository: InMemoryModelRepository;
  let sut: GetModelUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    modelRepository = new InMemoryModelRepository();
    sut = new GetModelUseCase(modelRepository, adminRepository);
  });

  it("returns an existing model", async () => {
    const admin = MakeAdmin({});
    const model = MakeModel({ adminId: admin.id.toString() });
    await adminRepository.create(admin);
    await modelRepository.create(model);

    const result = await sut.execute({
      Id: admin.id.toString(),
      modelId: model.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.model).toBe(model);
    }
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({ Id: "missing-admin", modelId: "model" });

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
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
