import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { MakeModel } from "../../../../../../test/factory/make-model";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryModelRepository } from "../../../../../../test/in-memory-repository/in-memory-model-repository";
import { SearchModelsUseCase } from "./search-models-use-case";

describe("Search models", () => {
  let adminRepository: InMemoryAdminRepository;
  let modelRepository: InMemoryModelRepository;
  let sut: SearchModelsUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    modelRepository = new InMemoryModelRepository();
    sut = new SearchModelsUseCase(modelRepository, adminRepository);
  });

  it("returns models for the requested company", async () => {
    const admin = MakeAdmin({});
    const model = MakeModel({ company: "Acme" });
    await adminRepository.create(admin);
    await modelRepository.create(model);

    const result = await sut.execute({
      Id: admin.id.toString(),
      company: "Acme",
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.models).toEqual([model]);
    }
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({
      Id: "missing-admin",
      company: "Acme",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("returns not found when no company model matches", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({
      Id: admin.id.toString(),
      company: "Unknown",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
