import { Entity } from "@/core/entity";
import type { UniqueEntityID } from "@/core/unique-entityId";

export interface ClientProps {
  adminId: string;
  clientName: string;
  cellphone: number;
  dateOfCreation: Date;
}
export class Client extends Entity<ClientProps> {
  get clientName() {
    return this.props.clientName;
  }
  get adminId() {
    return this.props.adminId;
  }
  get cellphone() {
    return this.props.cellphone;
  }

  get dateOfCreation() {
    return this.props.dateOfCreation;
  }

  set clientName(clientName: string) {
    this.props.clientName = clientName;
  }

  set adminId(adminId: string) {
    this.props.adminId = adminId;
  }

  set cellphone(cellphone: number) {
    this.props.cellphone = cellphone;
  }

  static create(props: ClientProps, id?: UniqueEntityID) {
    const client = new Client(props, id);
    return client;
  }
}
