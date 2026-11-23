import type { modelRepository } from "@/domain/aplication/repository/model-repository";
import type { Model } from "@/domain/enterprise/model";

export class InMemoryModelRepository implements modelRepository {
  items: Model[] = [];

  async create(model: Model): Promise<Model> {
    this.items.push(model);
    return model;
  }

  async findById(id: string): Promise<Model | null> {
    return this.items.find((model) => model.id.toString() === id) ?? null;
  }

  async findManyByAdminId(id: string): Promise<Model[] | null> {
    const models = this.items.filter((model) => model.adminId === id);
    return models.length > 0 ? models : null;
  }

  async findManyByCompany(company: string): Promise<Model[] | null> {
    const models = this.items.filter((model) => model.company === company);
    return models.length > 0 ? models : null;
  }

  async findByAdminId(id: string): Promise<Model | null> {
    return this.items.find((model) => model.adminId === id) ?? null;
  }

  async save(model: Model): Promise<Model> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === model.id.toString(),
    );

    if (index === -1) {
      this.items.push(model);
    } else {
      this.items[index] = model;
    }

    return model;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((model) => model.id.toString() !== id);
  }
}
