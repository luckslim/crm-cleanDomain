import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { MakeRecord } from "../../../../../test/factory/make-record";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryRecordRepository } from "../../../../../test/in-memory-repository/in-memory-record-repository";
import { GetAllRecordUseCase } from "./get-all-record-use-case";

describe("Get all records", () => {
  let adminRepository: InMemoryAdminRepository;
  let recordRepository: InMemoryRecordRepository;
  let sut: GetAllRecordUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    recordRepository = new InMemoryRecordRepository();
    sut = new GetAllRecordUseCase(adminRepository, recordRepository);
  });

  it("returns all records belonging to the admin", async () => {
    const admin = MakeAdmin({});
    const records = [
      MakeRecord({ adminId: admin.id.toString() }),
      MakeRecord({ adminId: admin.id.toString() }),
    ];
    await adminRepository.create(admin);
    for (const record of records) await recordRepository.create(record);
    await recordRepository.create(MakeRecord({ adminId: "another-admin" }));

    const result = await sut.execute({ Id: admin.id.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.record).toEqual(records);
    }
  });

  it("returns not found when the admin does not exist", async () => {
    const result = await sut.execute({ Id: "missing-admin" });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("returns not found when the admin has no records", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({ Id: admin.id.toString() });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
