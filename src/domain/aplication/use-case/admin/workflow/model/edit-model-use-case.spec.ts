import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../../../test/factory/make-admin";
import { MakeModel } from "../../../../../../../test/factory/make-model";
import { InMemoryAdminRepository } from "../../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryModelRepository } from "../../../../../../../test/in-memory-repository/in-memory-model-repository";
import { EditModelUseCase } from "./edit-model-use-case";

describe("Edit model", () => {
  let adminRepository: InMemoryAdminRepository;
  let modelRepository: InMemoryModelRepository;
  let sut: EditModelUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    modelRepository = new InMemoryModelRepository();
    sut = new EditModelUseCase(modelRepository, adminRepository);
  });

  it("updates a model owned by the admin", async () => {
    const admin = MakeAdmin({});
    const model = MakeModel({ adminId: admin.id.toString() });
    await adminRepository.create(admin);
    await modelRepository.create(model);

    const result = await sut.execute({
      Id: admin.id.toString(),
      modelId: model.id.toString(),
      company: "Updated company",
    });

    expect(result.isRight()).toBe(true);
    expect(modelRepository.items[0]?.company).toBe("Updated company");
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({
      Id: "missing-admin",
      modelId: "model",
      company: "Updated company",
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
      company: "Updated company",
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
      company: "Updated company",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });
});
