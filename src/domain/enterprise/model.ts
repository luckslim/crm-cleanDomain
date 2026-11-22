import { Entity } from "@/core/entity";
import type { UniqueEntityID } from "@/core/unique-entityId";

export interface ModelProps {
  adminId: string;
  company: string;
  dateOfCreation: Date;
}
export class Model extends Entity<ModelProps> {
  get adminId() {
    return this.props.adminId;
  }

  get company() {
    return this.props.company;
  }

  get dateOfCreation() {
    return this.props.dateOfCreation;
  }

  set adminId(adminId: string) {
    this.props.adminId = adminId;
  }

  set company(company: string) {
    this.props.company = company;
  }

  set dateOfCreation(dateOfCreation: Date) {
    this.props.dateOfCreation = dateOfCreation;
  }

  static create(props:  ModelProps, id?: UniqueEntityID) {
    const model = new Model(props, id);
    return model;
  }
}
