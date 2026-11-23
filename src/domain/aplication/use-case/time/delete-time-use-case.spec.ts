import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { MakeTime } from "../../../../../test/factory/make-time";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryTimeRepository } from "../../../../../test/in-memory-repository/in-memory-time-repository";
import { DeleteTimeUseCase } from "./delete-time-use-case";

describe("Delete time", () => {
  let adminRepository: InMemoryAdminRepository;
  let timeRepository: InMemoryTimeRepository;
  let sut: DeleteTimeUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    timeRepository = new InMemoryTimeRepository();
    sut = new DeleteTimeUseCase(timeRepository, adminRepository);
  });

  it("deletes an existing time", async () => {
    const admin = MakeAdmin({});
    const time = MakeTime({ adminId: admin.id.toString() });
    await adminRepository.create(admin);
    await timeRepository.create(time);

    const result = await sut.execute({
      Id: admin.id.toString(),
      timeId: time.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(timeRepository.items).toHaveLength(0);
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({
      Id: "missing-admin",
      timeId: "time",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("returns not found when the time does not exist", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({
      Id: admin.id.toString(),
      timeId: "missing-time",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
