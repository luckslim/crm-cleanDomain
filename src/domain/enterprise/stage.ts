import { Entity } from "@/core/entity";
import type { Optional } from "@/core/types/optional";
import type { UniqueEntityID } from "@/core/unique-entityId";

export interface StageProps {
  groupId: string;
  name: string;
  color: string | null;
  dateOfCreation: Date;
}
export class Stage extends Entity<StageProps> {
  get name() {
    return this.props.name;
  }

  get color() {
    return this.props.color;
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

  set color(color: string | null) {
    this.props.color = color;
  }

  set groupId(groupId: string) {
    this.props.groupId = groupId;
  }

  set dateOfCreation(dateOfCreation: Date) {
    this.props.dateOfCreation = dateOfCreation;
  }

  static create(props: Optional<StageProps, "color">, id?: UniqueEntityID) {
    const stage = new Stage({ ...props, color: props.color ?? null }, id);
    return stage;
  }
}
