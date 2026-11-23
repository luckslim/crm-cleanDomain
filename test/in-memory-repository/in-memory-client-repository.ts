import type {
  ClientParams,
  clientRepository,
} from "@/domain/aplication/repository/client-repository";
import type { Client } from "@/domain/enterprise/client";

export class InMemoryClientRepository implements clientRepository {
  items: Client[] = [];

  async create(client: Client): Promise<Client> {
    this.items.push(client);
    return client;
  }

  async findByParams(params: ClientParams): Promise<Client[] | null> {
    const clients = this.items.filter(
      (client) =>
        client.adminId === params.Id &&
        (params.clientName === undefined ||
          client.clientName === params.clientName) &&
        (params.cellphone === undefined ||
          client.cellphone === params.cellphone),
    );

    return clients.length > 0 ? clients : null;
  }

  async findById(id: string): Promise<Client | null> {
    return this.items.find((client) => client.id.toString() === id) ?? null;
  }

  async save(client: Client): Promise<Client> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === client.id.toString(),
    );

    if (index === -1) {
      this.items.push(client);
    } else {
      this.items[index] = client;
    }

    return client;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((client) => client.id.toString() !== id);
  }
}
