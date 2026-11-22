import type { Stage } from "@/domain/enterprise/stage";

export interface stageRepository {
  create(stage: Stage): Promise<Stage>;
  findById(id: string): Promise<Stage | null>;
  findByGroupId(id: string): Promise<Stage[] | null>;
  save(stage: Stage): Promise<Stage>;
  delete(id: string): Promise<void>;
}
