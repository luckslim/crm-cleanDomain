import type { stageRepository } from "@/domain/aplication/repository/stage-repository";
import type { Stage } from "@/domain/enterprise/stage";

export class InMemoryStageRepository implements stageRepository {
  items: Stage[] = [];

  async create(stage: Stage): Promise<Stage> {
    this.items.push(stage);
    return stage;
  }

  async findById(id: string): Promise<Stage | null> {
    return this.items.find((stage) => stage.id.toString() === id) ?? null;
  }

  async findManyByGroupId(id: string): Promise<Stage[] | null> {
    const stages = this.items.filter((stage) => stage.groupId === id);
    return stages.length > 0 ? stages : null;
  }

  async save(stage: Stage): Promise<Stage> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === stage.id.toString(),
    );

    if (index === -1) {
      this.items.push(stage);
    } else {
      this.items[index] = stage;
    }

    return stage;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((stage) => stage.id.toString() !== id);
  }
}
