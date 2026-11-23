import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { FakeHashGenerator } from "../../../../../test/cryptography/fake-hasher-generator";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { MakeClient } from "../../../../../test/factory/make-client";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryClientRepository } from "../../../../../test/in-memory-repository/in-memory-client-repository";
import { EditClientUseCase } from "./edit-client-use-case";

describe("Edit client", () => {
  let adminRepository: InMemoryAdminRepository;
  let clientRepository: InMemoryClientRepository;
  let hashGenerator: FakeHashGenerator;
  let sut: EditClientUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    clientRepository = new InMemoryClientRepository();
    hashGenerator = new FakeHashGenerator();
    sut = new EditClientUseCase(
      clientRepository,
      adminRepository,
      hashGenerator,
    );
  });

  it("updates a client owned by the admin", async () => {
    const admin = MakeAdmin({});
    const client = MakeClient({ adminId: admin.id.toString() });
    await adminRepository.create(admin);
    await clientRepository.create(client);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      clientId: client.id.toString(),
      clientName: "Jane Updated",
      cellphone: 5511888888888,
    });

    expect(result.isRight()).toBe(true);
    expect(clientRepository.items[0]).toMatchObject({
      clientName: "Jane Updated",
      cellphone: 5511888888888,
    });
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({
      adminId: "missing-admin",
      clientId: "client",
      clientName: "Jane Updated",
      cellphone: 5511888888888,
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("returns not found when the client does not exist", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      clientId: "missing-client",
      clientName: "Jane Updated",
      cellphone: 5511888888888,
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("rejects a client owned by another admin", async () => {
    const admin = MakeAdmin({});
    const client = MakeClient({ adminId: "another-admin" });
    await adminRepository.create(admin);
    await clientRepository.create(client);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      clientId: client.id.toString(),
      clientName: "Jane Updated",
      cellphone: 5511888888888,
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });
});
