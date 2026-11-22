import { Entity } from "@/core/entity";
import type { UniqueEntityID } from "@/core/unique-entityId";

export interface ScheduleProps {
  adminId: string;
  clientId: string;
  recordId: string;
  timeId: string;
  dateOfSchedule: Date;
  dateOfCreation: Date;
}
export class Schedule extends Entity<ScheduleProps> {
  get adminId() {
    return this.props.adminId;
  }
  get recordId() {
    return this.props.recordId;
  }
  get clientId() {
    return this.props.clientId;
  }
  get timeId() {
    return this.props.timeId;
  }
  get dateOfSchedule() {
    return this.props.dateOfSchedule;
  }
  get dateOfCreation() {
    return this.props.dateOfCreation;
  }

  set clientId(clientId: string) {
    this.props.clientId = clientId;
  }
  set recordId(recordId: string) {
    this.props.recordId = recordId;
  }
  set adminId(adminId: string) {
    this.props.adminId = adminId;
  }
  set timeId(timeId: string) {
    this.props.timeId = timeId;
  }
  set dateOfSchedule(date: Date) {
    this.props.dateOfSchedule = date;
  }
  set dateOfCreation(dateOfCreation: Date) {
    this.props.dateOfCreation = dateOfCreation;
  }

  static create(props: ScheduleProps, id?: UniqueEntityID) {
    const schedule = new Schedule(props, id);
    return schedule;
  }
}
