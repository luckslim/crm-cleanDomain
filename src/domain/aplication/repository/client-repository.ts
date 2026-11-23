import type { Client } from "@/domain/enterprise/client";
export interface ClientParams {
  Id: string;
  clientName?: string;
  cellphone?: number;
}
export interface clientRepository {
  create(client: Client): Promise<Client>;
  findByParams(params: ClientParams): Promise<Client[] | null>;
  findById(id: string): Promise<Client | null>;
  save(client: Client): Promise<Client>;
  delete(id: string): Promise<void>;
}
