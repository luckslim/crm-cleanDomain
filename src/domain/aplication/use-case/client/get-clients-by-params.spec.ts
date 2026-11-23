import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { MakeClient } from "../../../../../test/factory/make-client";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryClientRepository } from "../../../../../test/in-memory-repository/in-memory-client-repository";
import { GetClientUseCase } from "./get-clients-by-params";

describe("Get clients by params", () => {
  let adminRepository: InMemoryAdminRepository;
  let clientRepository: InMemoryClientRepository;
  let sut: GetClientUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    clientRepository = new InMemoryClientRepository();
    sut = new GetClientUseCase(clientRepository, adminRepository);
  });

  it("returns clients matching the admin and filters", async () => {
    const admin = MakeAdmin({});
    const client = MakeClient({
      adminId: admin.id.toString(),
      clientName: "Jane Doe",
      cellphone: 5511999999999,
    });
    await adminRepository.create(admin);
    await clientRepository.create(client);
    await clientRepository.create(
      MakeClient({ adminId: "another-admin", clientName: "Jane Doe" }),
    );

    const result = await sut.execute({
      Id: admin.id.toString(),
      clientName: "Jane Doe",
      cellphone: 5511999999999,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.clients).toEqual([client]);
    }
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({ Id: "missing-admin" });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("returns not found when no clients match", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({ Id: admin.id.toString() });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
