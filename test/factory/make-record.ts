import type { UniqueEntityID } from "@/core/unique-entityId";
import { Record, type RecordProps } from "@/domain/enterprise/record";
import { faker } from "@faker-js/faker";

export function MakeRecord(override: Partial<RecordProps>, id?: UniqueEntityID) {
  const record = Record.create(
    {
      adminId: faker.string.uuid(),
      clientId: faker.string.uuid(),
      type: faker.word.noun(),
      stage: null,
      interest: null,
      origin: faker.word.noun(),
      propertyOfInterest: faker.location.streetAddress(),
      budget: faker.finance.amount(),
      nextContact: faker.date.future(),
      period: faker.word.noun(),
      tags: faker.lorem.words(),
      notes: faker.lorem.sentence(),
      dateOfCreation: new Date(),
      ...override,
    },
    id,
  );
  return record;
}
