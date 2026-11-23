import type { UniqueEntityID } from "@/core/unique-entityId";
import { Model, type ModelProps } from "@/domain/enterprise/model";
import { faker } from "@faker-js/faker";

export function MakeModel(override: Partial<ModelProps>, id?: UniqueEntityID) {
  const model = Model.create(
    {
      adminId: faker.string.uuid(),
      company: faker.company.name(),
      dateOfCreation: new Date(),
      ...override,
    },
    id,
  );
  return model;
}
