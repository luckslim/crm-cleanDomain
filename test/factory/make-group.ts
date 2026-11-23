import type { UniqueEntityID } from "@/core/unique-entityId";
import { Group, type GroupProps } from "@/domain/enterprise/group";
import { faker } from "@faker-js/faker";

export function MakeGroup(override: Partial<GroupProps>, id?: UniqueEntityID) {
  const group = Group.create(
    {
      modelId: faker.string.uuid(),
      type: faker.word.noun(),
      dateOfCreation: new Date(),
      ...override,
    },
    id,
  );
  return group;
}
