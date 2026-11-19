import { Entity } from "@/core/entity";
import type { UniqueEntityID } from "@/core/unique-entityId";

export interface ScheduleProps {
  adminId: string;
  clientId: string;
  timeOfSchedule: string;
  dateOfSchedule: Date;
  dateOfCreation: Date;
}
export class Schedule extends Entity<ScheduleProps> {
  get adminId() {
    return this.props.adminId;
  }
  get clientId() {
    return this.props.clientId;
  }
  get timeOfSchedule() {
    return this.props.timeOfSchedule;
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
  set adminId(adminId: string) {
    this.props.adminId = adminId;
  }
  set timeOfSchedule(timeOfSchedule: string) {
    this.props.timeOfSchedule = timeOfSchedule;
  }
  set dateOfSchedule(date: Date) {
    this.props.dateOfSchedule = date;
  }
  set dateOfCreation(dateOfCreation: Date) {
    this.props.dateOfCreation = dateOfCreation;
  }

  static create(props: Schedule, id?: UniqueEntityID) {
    const schedule = new Schedule(props, id);
    return schedule;
  }
}
