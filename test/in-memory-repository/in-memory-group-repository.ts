import type { groupRepository } from "@/domain/aplication/repository/group-repository";
import type { Group } from "@/domain/enterprise/group";

export class InMemoryGroupRepository implements groupRepository {
  items: Group[] = [];

  async create(group: Group): Promise<Group> {
    this.items.push(group);
    return group;
  }

  async findById(id: string): Promise<Group | null> {
    return this.items.find((group) => group.id.toString() === id) ?? null;
  }

  async findManyByModelId(id: string): Promise<Group[] | null> {
    const groups = this.items.filter((group) => group.modelId === id);
    return groups.length > 0 ? groups : null;
  }

  async save(group: Group): Promise<Group> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === group.id.toString(),
    );

    if (index === -1) {
      this.items.push(group);
    } else {
      this.items[index] = group;
    }

    return group;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((group) => group.id.toString() !== id);
  }
}
