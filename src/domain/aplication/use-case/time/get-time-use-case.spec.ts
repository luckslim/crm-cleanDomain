import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { vi } from "vitest";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { MakeTime } from "../../../../../test/factory/make-time";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryTimeRepository } from "../../../../../test/in-memory-repository/in-memory-time-repository";
import { GetTimeUseCase } from "./get-time-use-case";

describe("Get time", () => {
  let adminRepository: InMemoryAdminRepository;
  let timeRepository: InMemoryTimeRepository;
  let sut: GetTimeUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    timeRepository = new InMemoryTimeRepository();
    sut = new GetTimeUseCase(timeRepository, adminRepository);
  });

  it("returns success for an existing time", async () => {
    const admin = MakeAdmin({});
    const time = MakeTime({ adminId: admin.id.toString() });
    const get = vi.fn().mockResolvedValue(time);
    Object.assign(timeRepository, { get });
    await adminRepository.create(admin);
    await timeRepository.create(time);

    const result = await sut.execute({
      Id: admin.id.toString(),
      timeId: time.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(get).toHaveBeenCalledWith(time.id.toString());
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
