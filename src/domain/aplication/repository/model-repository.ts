import type { Model } from "@/domain/enterprise/model";

export interface modelRepository {
  create(model: Model): Promise<Model>;
  findById(id: string): Promise<Model | null>;
  findManyByAdminId(id: string): Promise<Model[] | null>;
  findByAdminId(id: string): Promise<Model | null>;
  save(model: Model): Promise<Model>;
  delete(id: string): Promise<void>;
}
