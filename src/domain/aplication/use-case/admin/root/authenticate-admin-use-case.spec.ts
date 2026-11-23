import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials-error";
import { FakeEncrypter } from "../../../../../../test/cryptography/fake-encrypter";
import { FakeHashComparer } from "../../../../../../test/cryptography/fake-hasher-comparer";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { GetAdminUseCase } from "./authenticate-admin-use-case";

describe("Authenticate admin", () => {
  let adminRepository: InMemoryAdminRepository;
  let hashComparer: FakeHashComparer;
  let encrypter: FakeEncrypter;
  let sut: GetAdminUseCase;

  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    hashComparer = new FakeHashComparer();
    encrypter = new FakeEncrypter();
    sut = new GetAdminUseCase(adminRepository, hashComparer, encrypter);
  });

  it("authenticates an admin and returns an access token", async () => {
    const admin = MakeAdmin({ password: "hashed-secret" });
    await adminRepository.create(admin);

    const result = await sut.execute({
      email: admin.email,
      password: "secret",
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.access_token).toBe(
        JSON.stringify({ sub: admin.id }),
      );
    }
  });

  it("returns not found when the email is unknown", async () => {
    const result = await sut.execute({
      email: "missing@example.com",
      password: "secret",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("rejects an incorrect password", async () => {
    const admin = MakeAdmin({ password: "hashed-secret" });
    await adminRepository.create(admin);

    const result = await sut.execute({
      email: admin.email,
      password: "incorrect",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(WrongCredentialsError);
    }
  });
});
