import type { UniqueEntityID } from "@/core/unique-entityId";
import { Stage, type StageProps } from "@/domain/enterprise/stage";
import { faker } from "@faker-js/faker";

export function MakeStage(override: Partial<StageProps>, id?: UniqueEntityID) {
  const stage = Stage.create(
    {
      groupId: faker.string.uuid(),
      name: faker.word.noun(),
      dateOfCreation: new Date(),
      ...override,
    },
    id,
  );
  return stage;
}
