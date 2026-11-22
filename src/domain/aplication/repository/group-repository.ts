import type { Group } from "@/domain/enterprise/group";

export interface groupRepository {
  create(group: Group): Promise<Group>;
  findById(id: string): Promise<Group | null>;
  findManyByModelId(id: string): Promise<Group[] | null>;
  save(group: Group): Promise<Group>;
  delete(id: string): Promise<void>;
}
