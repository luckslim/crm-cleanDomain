import { Entity } from "@/core/entity";
import type { UniqueEntityID } from "@/core/unique-entityId";

export interface TimeProps {
  adminId: string;
  time: string;
  dateOfCreation: Date;
}
export class Time extends Entity<TimeProps> {
  get adminId() {
    return this.props.adminId;
  }
  get time() {
    return this.props.time;
  }
  get dateOfCreation() {
    return this.props.dateOfCreation;
  }

  set adminId(adminId: string) {
    this.props.adminId = adminId;
  }
  set time(time: string) {
    this.props.time = time;
  }
  set dateOfCreation(dateOfCreation: Date) {
    this.props.dateOfCreation = dateOfCreation;
  }
  static create(props: Time, id?: UniqueEntityID) {
    const time = new Time(props, id);
    return time;
  }
}
