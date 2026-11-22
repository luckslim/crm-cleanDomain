import type { Time } from "@/domain/enterprise/time";

export interface timeRepository {
  create(time: Time): Promise<Time>;
  findById(id: string): Promise<Time | null>;
  save(time: Time): Promise<Time>;
  delete(id: string): Promise<void>;
}
