import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { MakeClient } from "../../../../../test/factory/make-client";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryClientRepository } from "../../../../../test/in-memory-repository/in-memory-client-repository";
import { DeleteClientUseCase } from "./delete-client-use-case";

describe("Delete client", () => {
  let adminRepository: InMemoryAdminRepository;
  let clientRepository: InMemoryClientRepository;
  let sut: DeleteClientUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    clientRepository = new InMemoryClientRepository();
    sut = new DeleteClientUseCase(clientRepository, adminRepository);
  });

  it("deletes a client owned by the admin", async () => {
    const admin = MakeAdmin({});
    const client = MakeClient({ adminId: admin.id.toString() });
    await adminRepository.create(admin);
    await clientRepository.create(client);

    const result = await sut.execute({
      Id: admin.id.toString(),
      clientId: client.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(clientRepository.items).toHaveLength(0);
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({
      Id: "missing-admin",
      clientId: "client",
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
      Id: admin.id.toString(),
      clientId: "missing-client",
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
      Id: admin.id.toString(),
      clientId: client.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });
});
