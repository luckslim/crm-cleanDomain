import type { Stage } from "@/domain/enterprise/stage";

export interface stageRepository {
  create(stage: Stage): Promise<Stage>;
  findById(id: string | undefined): Promise<Stage | null>;
  findManyByGroupId(id: string): Promise<Stage[] | null>;
  save(stage: Stage): Promise<Stage>;
  delete(id: string): Promise<void>;
}
