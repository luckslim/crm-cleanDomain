import type { Schedule } from "@/domain/enterprise/schedule";

export interface scheduleRepository {
  create(schedule: Schedule): Promise<Schedule>;
  findById(id: string): Promise<Schedule | null>;
  findManyByAdminId(id: string): Promise<Schedule[] | null>;
  findManyByClientId(id: string): Promise<Schedule[] | null>;
  save(schedule: Schedule): Promise<Schedule>;
  delete(id: string): Promise<void>;
}
