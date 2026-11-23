import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { MakeClient } from "../../../../../test/factory/make-client";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryClientRepository } from "../../../../../test/in-memory-repository/in-memory-client-repository";
import { GetClientUseCase } from "./get-client-by-adminId";

describe("Get client by admin ID", () => {
  let adminRepository: InMemoryAdminRepository;
  let clientRepository: InMemoryClientRepository;
  let sut: GetClientUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    clientRepository = new InMemoryClientRepository();
    sut = new GetClientUseCase(clientRepository, adminRepository);
  });

  it("returns a client owned by the admin", async () => {
    const admin = MakeAdmin({});
    const client = MakeClient({ adminId: admin.id.toString() });
    await adminRepository.create(admin);
    await clientRepository.create(client);

    const result = await sut.execute({
      Id: admin.id.toString(),
      clientId: client.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.client).toBe(client);
    }
  });

  it("returns not found when the admin or client does not exist", async () => {
    const missingAdmin = await sut.execute({
      Id: "missing-admin",
      clientId: "client",
    });
    expect(missingAdmin.isLeft()).toBe(true);
    if (missingAdmin.isLeft()) {
      expect(missingAdmin.value).toBeInstanceOf(ResourceNotFoundError);
    }

    const admin = MakeAdmin({});
    await adminRepository.create(admin);
    const missingClient = await sut.execute({
      Id: admin.id.toString(),
      clientId: "missing-client",
    });
    expect(missingClient.isLeft()).toBe(true);
    if (missingClient.isLeft()) {
      expect(missingClient.value).toBeInstanceOf(ResourceNotFoundError);
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
