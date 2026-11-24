import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../../../test/factory/make-admin";
import { InMemoryAdminRepository } from "../../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryModelRepository } from "../../../../../../../test/in-memory-repository/in-memory-model-repository";
import { CreateModelUseCase } from "./create-model-use-case";
import { MakeModel } from "../../../../../../../test/factory/make-model";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

describe("Create model", () => {
  let adminRepository: InMemoryAdminRepository;
  let modelRepository: InMemoryModelRepository;
  let sut: CreateModelUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    modelRepository = new InMemoryModelRepository();
    sut = new CreateModelUseCase(modelRepository, adminRepository);
  });

  it("creates a model for an existing admin", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({
      Id: admin.id.toString(),
      company: "Acme",
    });

    expect(result.isRight()).toBe(true);
    expect(modelRepository.items).toHaveLength(1);
    expect(modelRepository.items[0]?.adminId).toBe(admin.id.toString());
    expect(modelRepository.items[0]?.company).toBe("Acme");
  });

  it("returns not allowed when the admin have a model", async () => {
    const admin = MakeAdmin({});

    await adminRepository.create(admin);

    const model = MakeModel({ adminId: admin.id.toString() });

    await modelRepository.create(model);

    const result = await sut.execute({
      Id: admin.id.toString(),
      company: model.company,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
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
});
