import { Entity } from "@/core/entity";
import type { UniqueEntityID } from "@/core/unique-entityId";

export interface GroupProps {
  modelId: string;
  type: string;
  dateOfCreation: Date;
}
export class Group extends Entity<GroupProps> {
  get modelId() {
    return this.props.modelId;
  }

  get type() {
    return this.props.type;
  }

  get dateOfCreation() {
    return this.props.dateOfCreation;
  }

  set modelId(modelId: string) {
    this.props.modelId = modelId;
  }

  set type(type: string) {
    this.props.type = type;
  }

  set dateOfCreation(dateOfCreation: Date) {
    this.props.dateOfCreation = dateOfCreation;
  }

  static create(props:  GroupProps, id?: UniqueEntityID) {
    const group = new Group(props, id);
    return group;
  }
}
