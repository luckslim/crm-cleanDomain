import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { DeleteAdminUseCase } from "./delete-admin-use-case";

describe("Delete admin", () => {
  let adminRepository: InMemoryAdminRepository;
  let sut: DeleteAdminUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    sut = new DeleteAdminUseCase(adminRepository);
  });

  it("deletes an existing admin", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({ Id: admin.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(adminRepository.items).toHaveLength(0);
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({ Id: "missing-id" });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
