import { CreateAdminUseCase } from "./create-admin-use-case";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { FakeHashGenerator } from "../../../../../../test/cryptography/fake-hasher-generator";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { EmailAlreadyExistError } from "@/core/errors/email-already-exist-error";

let inMemoryAdminRepository: InMemoryAdminRepository;
let hashGenerator: FakeHashGenerator;
let sut: CreateAdminUseCase;

describe("Create admin", () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();
    hashGenerator = new FakeHashGenerator();
    sut = new CreateAdminUseCase(inMemoryAdminRepository, hashGenerator);
  });

  it("deve criar admin", async () => {
    const admin = MakeAdmin({});

    const result = await sut.execute({
      adminName: admin.adminName,
      dateOfCreation: admin.dateOfCreation,
      email: admin.email,
      password: "123123",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAdminRepository.items).toHaveLength(1);
    expect(inMemoryAdminRepository.items[0]?.password).toBe("hashed-123123");
  });

  it("deve rejeitar um e-mail já cadastrado", async () => {
    const admin = MakeAdmin({});
    await inMemoryAdminRepository.create(admin);

    const result = await sut.execute({
      adminName: admin.adminName,
      dateOfCreation: admin.dateOfCreation,
      email: admin.email,
      password: "123123",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(EmailAlreadyExistError);
    }
  });
});
