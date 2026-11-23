import type { scheduleRepository } from "@/domain/aplication/repository/schedule-repository";
import type { Schedule } from "@/domain/enterprise/schedule";

export class InMemoryScheduleRepository implements scheduleRepository {
  items: Schedule[] = [];

  async create(schedule: Schedule): Promise<Schedule> {
    this.items.push(schedule);
    return schedule;
  }

  async findById(id: string): Promise<Schedule | null> {
    return (
      this.items.find((schedule) => schedule.id.toString() === id) ?? null
    );
  }

  async findManyByAdminId(id: string): Promise<Schedule[] | null> {
    const schedules = this.items.filter((schedule) => schedule.adminId === id);
    return schedules.length > 0 ? schedules : null;
  }

  async findManyByClientId(id: string): Promise<Schedule[] | null> {
    const schedules = this.items.filter((schedule) => schedule.clientId === id);
    return schedules.length > 0 ? schedules : null;
  }

  async save(schedule: Schedule): Promise<Schedule> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === schedule.id.toString(),
    );

    if (index === -1) {
      this.items.push(schedule);
    } else {
      this.items[index] = schedule;
    }

    return schedule;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((schedule) => schedule.id.toString() !== id);
  }
}
