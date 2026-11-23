import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { FakeHashGenerator } from "../../../../../test/cryptography/fake-hasher-generator";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryClientRepository } from "../../../../../test/in-memory-repository/in-memory-client-repository";
import { CreateClientUseCase } from "./create-client-use-case";

describe("Create client", () => {
  let adminRepository: InMemoryAdminRepository;
  let clientRepository: InMemoryClientRepository;
  let hashGenerator: FakeHashGenerator;
  let sut: CreateClientUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    clientRepository = new InMemoryClientRepository();
    hashGenerator = new FakeHashGenerator();
    sut = new CreateClientUseCase(
      clientRepository,
      adminRepository,
      hashGenerator,
    );
  });

  it("creates a client for an existing admin", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      clientName: "Jane Doe",
      cellphone: 5511999999999,
      dateOfCreation: new Date(),
    });

    expect(result.isRight()).toBe(true);
    expect(clientRepository.items).toHaveLength(1);
    expect(clientRepository.items[0]?.clientName).toBe("Jane Doe");
    expect(clientRepository.items[0]?.adminId).toBe(admin.id.toString());
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({
      adminId: "missing-admin",
      clientName: "Jane Doe",
      cellphone: 5511999999999,
      dateOfCreation: new Date(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
