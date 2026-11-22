import type { Admin } from "@/domain/enterprise/admin";

export interface adminRepository {
  create(admin: Admin): Promise<Admin>;
  findByEmail(email: string): Promise<Admin | null>;
  findById(id: string): Promise<Admin | null>;
  save(admin: Admin): Promise<Admin>;
  delete(id: string): Promise<void>;
}
