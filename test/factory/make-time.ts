import type { UniqueEntityID } from "@/core/unique-entityId";
import { Time, type TimeProps } from "@/domain/enterprise/time";
import { faker } from "@faker-js/faker";

export function MakeTime(override: Partial<TimeProps>, id?: UniqueEntityID) {
  const time = Time.create(
    {
      adminId: faker.string.uuid(),
      time: faker.date
        .between({ from: "2020-01-01T08:00:00.000Z", to: "2020-01-01T18:00:00.000Z" })
        .toISOString()
        .slice(11, 16),
      dateOfCreation: new Date(),
      ...override,
    },
    id,
  );
  return time;
}
