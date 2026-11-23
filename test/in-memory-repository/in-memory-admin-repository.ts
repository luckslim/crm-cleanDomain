import type { adminRepository } from "@/domain/aplication/repository/admin-repository";
import type { Admin } from "@/domain/enterprise/admin";

export class InMemoryAdminRepository implements adminRepository {
  items: Admin[] = [];

  async create(admin: Admin): Promise<Admin> {
    this.items.push(admin);
    return admin;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.items.find((admin) => admin.email === email) ?? null;
  }

  async findById(id: string): Promise<Admin | null> {
    return (
      this.items.find((admin) => admin.id.toString() === id) ?? null
    );
  }

  async save(admin: Admin): Promise<Admin> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === admin.id.toString(),
    );

    if (index === -1) {
      this.items.push(admin);
    } else {
      this.items[index] = admin;
    }

    return admin;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((admin) => admin.id.toString() !== id);
  }
}
