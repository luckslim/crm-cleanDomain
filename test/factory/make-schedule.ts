import type { UniqueEntityID } from "@/core/unique-entityId";
import { Schedule, type ScheduleProps } from "@/domain/enterprise/schedule";
import { faker } from "@faker-js/faker";

export function MakeSchedule(
  override: Partial<ScheduleProps>,
  id?: UniqueEntityID,
) {
  const schedule = Schedule.create(
    {
      adminId: faker.string.uuid(),
      clientId: faker.string.uuid(),
      recordId: faker.string.uuid(),
      timeId: faker.string.uuid(),
      dateOfSchedule: faker.date.future(),
      dateOfCreation: new Date(),
      ...override,
    },
    id,
  );
  return schedule;
}
