import type { recordRepository } from "@/domain/aplication/repository/record-repository";
import type { Record } from "@/domain/enterprise/record";

export class InMemoryRecordRepository implements recordRepository {
  items: Record[] = [];

  async create(record: Record): Promise<Record> {
    this.items.push(record);
    return record;
  }

  async findById(id: string): Promise<Record | null> {
    return this.items.find((record) => record.id.toString() === id) ?? null;
  }

  async findManyById(id: string): Promise<Record[] | null> {
    const records = this.items.filter((record) => record.adminId === id);
    return records.length > 0 ? records : null;
  }

  async findManyByStageId(id: string): Promise<Record[] | null> {
    const records = this.items.filter((record) => record.stageId === id);
    return records.length > 0 ? records : null;
  }

  async save(record: Record): Promise<Record> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === record.id.toString(),
    );

    if (index === -1) {
      this.items.push(record);
    } else {
      this.items[index] = record;
    }

    return record;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((record) => record.id.toString() !== id);
  }
}
