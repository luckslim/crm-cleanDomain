import type { Record } from "@/domain/enterprise/record";

export interface recordRepository {
  create(record: Record): Promise<Record>;
  findById(id: string): Promise<Record | null>;
  save(record: Record): Promise<Record>;
  delete(id: string): Promise<void>;
}
