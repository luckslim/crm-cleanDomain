import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryTimeRepository } from "../../../../../test/in-memory-repository/in-memory-time-repository";
import { CreateTimeUseCase } from "./create-time-use-case";

describe("Create time", () => {
  let adminRepository: InMemoryAdminRepository;
  let timeRepository: InMemoryTimeRepository;
  let sut: CreateTimeUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    timeRepository = new InMemoryTimeRepository();
    sut = new CreateTimeUseCase(timeRepository, adminRepository);
  });

  it("creates a time for an existing admin", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({
      Id: admin.id.toString(),
      time: "09:30",
    });

    expect(result.isRight()).toBe(true);
    expect(timeRepository.items).toHaveLength(1);
    expect(timeRepository.items[0]?.adminId).toBe(admin.id.toString());
    expect(timeRepository.items[0]?.time).toBe("09:30");
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({
      Id: "missing-admin",
      time: "09:30",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
