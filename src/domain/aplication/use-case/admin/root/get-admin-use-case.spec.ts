import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { GetAdminUseCase } from "./get-admin-use-case";

describe("Get admin", () => {
  let adminRepository: InMemoryAdminRepository;
  let sut: GetAdminUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    sut = new GetAdminUseCase(adminRepository);
  });

  it("returns an existing admin", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({ Id: admin.id.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.admin).toBe(admin);
    }
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({ Id: "missing-id" });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
