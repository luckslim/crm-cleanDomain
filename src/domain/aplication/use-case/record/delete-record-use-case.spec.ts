import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { MakeRecord } from "../../../../../test/factory/make-record";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryRecordRepository } from "../../../../../test/in-memory-repository/in-memory-record-repository";
import { DeleteRecordUseCase } from "./delete-record-use-case";

describe("Delete record", () => {
  let adminRepository: InMemoryAdminRepository;
  let recordRepository: InMemoryRecordRepository;
  let sut: DeleteRecordUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    recordRepository = new InMemoryRecordRepository();
    sut = new DeleteRecordUseCase(adminRepository, recordRepository);
  });

  it("deletes a record owned by the admin", async () => {
    const admin = MakeAdmin({});
    const record = MakeRecord({ adminId: admin.id.toString() });
    await adminRepository.create(admin);
    await recordRepository.create(record);

    const result = await sut.execute({
      Id: admin.id.toString(),
      recordId: record.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(recordRepository.items).toHaveLength(0);
  });

  it("returns not found when the admin or record does not exist", async () => {
    const missingAdmin = await sut.execute({
      Id: "missing-admin",
      recordId: "record",
    });
    expect(missingAdmin.isLeft()).toBe(true);
    if (missingAdmin.isLeft()) {
      expect(missingAdmin.value).toBeInstanceOf(ResourceNotFoundError);
    }

    const admin = MakeAdmin({});
    await adminRepository.create(admin);
    const missingRecord = await sut.execute({
      Id: admin.id.toString(),
      recordId: "missing-record",
    });
    expect(missingRecord.isLeft()).toBe(true);
    if (missingRecord.isLeft()) {
      expect(missingRecord.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("rejects a record owned by another admin", async () => {
    const admin = MakeAdmin({});
    const record = MakeRecord({ adminId: "another-admin" });
    await adminRepository.create(admin);
    await recordRepository.create(record);

    const result = await sut.execute({
      Id: admin.id.toString(),
      recordId: record.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
    expect(recordRepository.items).toContain(record);
  });
});
