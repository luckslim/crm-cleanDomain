import type { Client } from "@/domain/enterprise/client";

export abstract class clientRepository {
  abstract create(client: Client): Promise<Client>;
  abstract findByEmail(email: string, adminId: string): Promise<Client | null>;
  abstract findById(id: string): Promise<Client | null>;
  abstract save(client: Client): Promise<Client>;
  abstract delete(id: string): Promise<void>;
}
