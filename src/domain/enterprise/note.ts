import { Entity } from "@/core/entity";
import type { UniqueEntityID } from "@/core/unique-entityId";

export interface NoteProps {
  scheduleId: string;
  title: string;
  content: string;
  dateOfCreation: Date;
}
export class Note extends Entity<NoteProps> {
  get scheduleId() {
    return this.props.scheduleId;
  }
  get title() {
    return this.props.title;
  }
  get content() {
    return this.props.content;
  }
  get dateOfCreation() {
    return this.props.dateOfCreation;
  }

  set scheduleId(scheduleId: string) {
    this.props.scheduleId = scheduleId;
  }
  set title(title: string) {
    this.props.title = title;
  }
  set content(content: string) {
    this.props.content = content;
  }
  set dateOfCreation(dateOfCreation: Date) {
    this.props.dateOfCreation = dateOfCreation;
  }

  static create(props: Note, id?: UniqueEntityID) {
    const note = new Note(props, id);
    return note;
  }
}
