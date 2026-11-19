import { Entity } from "@/core/entity";
import type { UniqueEntityID } from "@/core/unique-entityId";

export interface ClientProps {
  adminId: string;
  clientName: string;
  email: string;
  urlImage: string;
  city: string;
  cep: number;
  street: string;
  state: string;
  number: number;
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
  get email() {
    return this.props.email;
  }
  get urlImage() {
    return this.props.urlImage;
  }
  get city() {
    return this.props.city;
  }
  get cep() {
    return this.props.cep;
  }
  get street() {
    return this.props.street;
  }
  get state() {
    return this.props.state;
  }
  get number() {
    return this.props.number;
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
  set email(email: string) {
    this.props.email = email;
  }
  set adminId(adminId: string) {
    this.props.adminId = adminId;
  }
  set urlImage(urlImage: string) {
    this.props.urlImage = urlImage;
  }
  set city(city: string) {
    this.props.city = city;
  }
  set cep(cep: number) {
    this.props.cep = cep;
  }
  set street(street: string) {
    this.props.street = street;
  }
  set state(state: string) {
    this.props.state = state;
  }
  set number(number: number) {
    this.props.number = number;
  }
  set cellphone(cellphone: number) {
    this.props.cellphone = cellphone;
  }

  static create(props: ClientProps, id?: UniqueEntityID) {
    const client = new Client(props, id);
    return client;
  }
}
