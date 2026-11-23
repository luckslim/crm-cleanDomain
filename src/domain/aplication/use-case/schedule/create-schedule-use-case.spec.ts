import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { MakeClient } from "../../../../../test/factory/make-client";
import { MakeTime } from "../../../../../test/factory/make-time";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryClientRepository } from "../../../../../test/in-memory-repository/in-memory-client-repository";
import { InMemoryScheduleRepository } from "../../../../../test/in-memory-repository/in-memory-schedule-repository";
import { InMemoryTimeRepository } from "../../../../../test/in-memory-repository/in-memory-time-repository";
import { CreateScheduleUseCase } from "./create-schedule-use-case";

describe("Create schedule", () => {
  let adminRepository: InMemoryAdminRepository;
  let clientRepository: InMemoryClientRepository;
  let scheduleRepository: InMemoryScheduleRepository;
  let timeRepository: InMemoryTimeRepository;
  let noteRepository: { findById: (id: string) => Promise<{ adminId: string } | null> };
  let sut: CreateScheduleUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    clientRepository = new InMemoryClientRepository();
    scheduleRepository = new InMemoryScheduleRepository();
    timeRepository = new InMemoryTimeRepository();
    noteRepository = {
      findById: async () => null,
    };
    sut = new CreateScheduleUseCase(
      scheduleRepository,
      adminRepository,
      noteRepository,
      clientRepository,
      timeRepository,
    );
  });

  it("returns success when all referenced records belong to the admin", async () => {
    const admin = MakeAdmin({});
    const client = MakeClient({ adminId: admin.id.toString() });
    const time = MakeTime({ adminId: admin.id.toString() });
    noteRepository.findById = async () => ({ adminId: admin.id.toString() });
    await adminRepository.create(admin);
    await clientRepository.create(client);
    await timeRepository.create(time);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      noteId: "note-id",
      clientId: client.id.toString(),
      timeId: time.id.toString(),
      dateOfSchedule: new Date(),
    });

    expect(result.isRight()).toBe(true);
  });

  it("returns not found when the admin, client, note, or time is missing", async () => {
    const missingAdmin = await sut.execute({
      adminId: "missing-admin",
      noteId: "note",
      clientId: "client",
      timeId: "time",
      dateOfSchedule: new Date(),
    });
    expect(missingAdmin.isLeft()).toBe(true);
    if (missingAdmin.isLeft()) {
      expect(missingAdmin.value).toBeInstanceOf(ResourceNotFoundError);
    }

    const admin = MakeAdmin({});
    const client = MakeClient({ adminId: admin.id.toString() });
    const time = MakeTime({ adminId: admin.id.toString() });
    await adminRepository.create(admin);

    const missingClient = await sut.execute({
      adminId: admin.id.toString(),
      noteId: "note",
      clientId: client.id.toString(),
      timeId: time.id.toString(),
      dateOfSchedule: new Date(),
    });
    expect(missingClient.isLeft()).toBe(true);
    if (missingClient.isLeft()) {
      expect(missingClient.value).toBeInstanceOf(ResourceNotFoundError);
    }

    await clientRepository.create(client);
    await timeRepository.create(time);

    const missingNote = await sut.execute({
      adminId: admin.id.toString(),
      noteId: "missing-note",
      clientId: client.id.toString(),
      timeId: time.id.toString(),
      dateOfSchedule: new Date(),
    });
    expect(missingNote.isLeft()).toBe(true);
    if (missingNote.isLeft()) {
      expect(missingNote.value).toBeInstanceOf(ResourceNotFoundError);
    }

    noteRepository.findById = async () => ({ adminId: admin.id.toString() });
    const missingTime = await sut.execute({
      adminId: admin.id.toString(),
      noteId: "note",
      clientId: client.id.toString(),
      timeId: "missing-time",
      dateOfSchedule: new Date(),
    });
    expect(missingTime.isLeft()).toBe(true);
    if (missingTime.isLeft()) {
      expect(missingTime.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("rejects records owned by a different admin", async () => {
    const admin = MakeAdmin({});
    const client = MakeClient({ adminId: "another-admin" });
    const time = MakeTime({ adminId: admin.id.toString() });
    noteRepository.findById = async () => ({ adminId: admin.id.toString() });
    await adminRepository.create(admin);
    await clientRepository.create(client);
    await timeRepository.create(time);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      noteId: "note-id",
      clientId: client.id.toString(),
      timeId: time.id.toString(),
      dateOfSchedule: new Date(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });
});
