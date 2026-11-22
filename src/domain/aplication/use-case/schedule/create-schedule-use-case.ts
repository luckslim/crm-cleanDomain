import { left, right, type Either } from "@/core/either";
import { EmailAlreadyExistError } from "@/core/errors/email-already-exist-error";
import type { scheduleRepository } from "../../repository/schedule-repository";
import type { adminRepository } from "../../repository/admin-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { noteRepository } from "../../repository/note-repository";
import type { clientRepository } from "../../repository/client-repository";
import type { timeRepository } from "../../repository/time-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface CreateScheduleRequest {
  adminId: string;
  noteId: string;
  clientId: string;
  timeId: string;
  dateOfSchedule: Date;
}

type CreateScheduleResponse = Either<
  EmailAlreadyExistError,
  { message: string }
>;
export class CreateScheduleUseCase {
  constructor(
    public scheduleRepository: scheduleRepository,
    public adminRepository: adminRepository,
    public noteRepository: noteRepository,
    public clientRepository: clientRepository,
    public timeRepository: timeRepository,
  ) {}
  async execute({
    adminId,
    noteId,
    clientId,
    timeId,
    dateOfSchedule,
  }: CreateScheduleRequest): Promise<CreateScheduleResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new ResourceNotFoundError(adminId));
    }

    const client = await this.clientRepository.findById(clientId);

    if (!client) {
      return left(new ResourceNotFoundError(clientId));
    }

    const note = await this.noteRepository.findById(noteId);

    if (!note) {
      return left(new ResourceNotFoundError(noteId));
    }

    const time = await this.timeRepository.findById(timeId);

    if (!time) {
      return left(new ResourceNotFoundError(timeId));
    }

    if (
      time.adminId !== admin.id.toString() ||
      note.adminId !== admin.id.toString() ||
      client.adminId !== admin.id.toString()
    ) {
      return left(new NotAllowedError("Credenciais não compatíveis"));
    }

    return right({ message: "Sua conta foi criada com sucesso!" });
  }
}
