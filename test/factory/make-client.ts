import type { UniqueEntityID } from "@/core/unique-entityId";
import { Client, type ClientProps } from "@/domain/enterprise/client";
import { faker } from "@faker-js/faker";

export function MakeClient(override: Partial<ClientProps>, id?: UniqueEntityID) {
  const client = Client.create(
    {
      adminId: faker.string.uuid(),
      clientName: faker.person.fullName(),
      cellphone: faker.number.int({ min: 1000000000, max: 99999999999 }),
      dateOfCreation: new Date(),
      ...override,
    },
    id,
  );
  return client;
}
