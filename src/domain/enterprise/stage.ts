import { Entity } from "@/core/entity";
import type { UniqueEntityID } from "@/core/unique-entityId";

export interface StageProps {
  groupId: string;
  name: string;
  dateOfCreation: Date;
}
export class Stage extends Entity<StageProps> {
  get name() {
    return this.props.name;
  }

  get groupId() {
    return this.props.groupId;
  }

  get dateOfCreation() {
    return this.props.dateOfCreation;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set groupId(groupId: string) {
    this.props.groupId = groupId;
  }

  set dateOfCreation(dateOfCreation: Date) {
    this.props.dateOfCreation = dateOfCreation;
  }

  static create(props: StageProps, id?: UniqueEntityID) {
    const stage = new Stage(props, id);
    return stage;
  }
}
