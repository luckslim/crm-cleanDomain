import { Entity } from "@/core/entity";
import type { Optional } from "@/core/types/optional";
import type { UniqueEntityID } from "@/core/unique-entityId";

export interface GroupProps {
  modelId: string;
  type: string;
  color: string | null;
  dateOfCreation: Date;
}
export class Group extends Entity<GroupProps> {
  get modelId() {
    return this.props.modelId;
  }

  get type() {
    return this.props.type;
  }
  get color() {
    return this.props.color;
  }
  get dateOfCreation() {
    return this.props.dateOfCreation;
  }

  set modelId(modelId: string) {
    this.props.modelId = modelId;
  }
  set color(color: string | null) {
    this.props.color = color;
  }

  set type(type: string) {
    this.props.type = type;
  }

  set dateOfCreation(dateOfCreation: Date) {
    this.props.dateOfCreation = dateOfCreation;
  }

  static create(props: Optional<GroupProps, "color">, id?: UniqueEntityID) {
    const group = new Group({ ...props, color: props.color ?? null }, id);
    return group;
  }
}
