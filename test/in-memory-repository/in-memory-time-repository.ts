import type { timeRepository } from "@/domain/aplication/repository/time-repository";
import type { Time } from "@/domain/enterprise/time";

export class InMemoryTimeRepository implements timeRepository {
  items: Time[] = [];

  async create(time: Time): Promise<Time> {
    this.items.push(time);
    return time;
  }

  async findById(id: string): Promise<Time | null> {
    return this.items.find((time) => time.id.toString() === id) ?? null;
  }

  async save(time: Time): Promise<Time> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === time.id.toString(),
    );

    if (index === -1) {
      this.items.push(time);
    } else {
      this.items[index] = time;
    }

    return time;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((time) => time.id.toString() !== id);
  }
}
