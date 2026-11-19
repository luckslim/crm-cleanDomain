import type { Admin } from "@/domain/enterprise/admin";

export abstract class adminRepository {
  abstract create(admin: Admin): Promise<Admin>;
  abstract findByEmail(email: string): Promise<Admin | null>;
  abstract findById(id: string): Promise<Admin | null>;
  abstract save(admin: Admin): Promise<Admin>;
  abstract delete(id: string): Promise<void>;
}
