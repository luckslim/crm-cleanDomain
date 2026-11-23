import type { UniqueEntityID } from "@/core/unique-entityId";
import { Admin, type AdminProps } from "@/domain/enterprise/admin";
import { faker } from "@faker-js/faker";

export function MakeAdmin(override: Partial<AdminProps>, id?: UniqueEntityID) {
  const admin = Admin.create(
    {
      email: faker.internet.email(),
      password: faker.internet.password(),
      adminName: faker.internet.username(),
      urlImage: faker.internet.url(),
      dateOfCreation: new Date(),
      ...override,
    },
    id,
  );
  return admin;
}
