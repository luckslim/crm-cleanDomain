import { EmailAlreadyExistError } from "@/core/errors/email-already-exist-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { FakeHashGenerator } from "../../../../../../test/cryptography/fake-hasher-generator";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { EditAdminUseCase } from "./edit-admin-use-case";

describe("Edit admin", () => {
  let adminRepository: InMemoryAdminRepository;
  let hashGenerator: FakeHashGenerator;
  let sut: EditAdminUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    hashGenerator = new FakeHashGenerator();
    sut = new EditAdminUseCase(adminRepository, hashGenerator);
  });

  it("updates the admin profile", async () => {
    const admin = MakeAdmin({});
    await adminRepository.create(admin);

    const result = await sut.execute({
      Id: admin.id.toString(),
      email: "updated@example.com",
      password: "new-secret",
      adminName: "Updated Admin",
    });

    expect(result.isRight()).toBe(true);
    expect(adminRepository.items[0]).toMatchObject({
      email: "updated@example.com",
      password: "hashed-new-secret",
      adminName: "Updated Admin",
      urlImage: "undefined",
    });
  });

  it("returns not found for a missing admin", async () => {
    const result = await sut.execute({
      Id: "missing-id",
      email: "updated@example.com",
      password: "new-secret",
      adminName: "Updated Admin",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("rejects an email used by another admin", async () => {
    const admin = MakeAdmin({});
    const otherAdmin = MakeAdmin({ email: "taken@example.com" });
    await adminRepository.create(admin);
    await adminRepository.create(otherAdmin);

    const result = await sut.execute({
      Id: admin.id.toString(),
      email: otherAdmin.email,
      password: "new-secret",
      adminName: "Updated Admin",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(EmailAlreadyExistError);
    }
  });
});
