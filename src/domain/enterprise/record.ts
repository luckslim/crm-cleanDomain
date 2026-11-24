import { Entity } from "@/core/entity";
import type { Optional } from "@/core/types/optional";
import type { UniqueEntityID } from "@/core/unique-entityId";

export interface RecordProps {
  adminId: string;
  clientId: string;
  groupId: string;
  stageId: string | null; //optional
  interest: string | null; //optional
  origin: string;
  propertyOfInterest: string;
  budget: string;
  nextContact: Date;
  period: string;
  tags: string;
  color: string | null;
  notes: string;
  dateOfCreation: Date;
}
export class Record extends Entity<RecordProps> {
  get adminId() {
    return this.props.adminId;
  }
  get clientId() {
    return this.props.clientId;
  }
  get groupId() {
    return this.props.groupId;
  }
  get stageId() {
    return this.props.stageId;
  }
  get color() {
    return this.props.color;
  }
  get interest() {
    return this.props.interest;
  }
  get origin() {
    return this.props.origin;
  }
  get propertyOfInterest() {
    return this.props.propertyOfInterest;
  }
  get budget() {
    return this.props.budget;
  }
  get nextContact() {
    return this.props.nextContact;
  }
  get period() {
    return this.props.period;
  }
  get tags() {
    return this.props.tags;
  }
  get notes() {
    return this.props.notes;
  }
  get dateOfCreation() {
    return this.props.dateOfCreation;
  }

  set adminId(adminId: string) {
    this.props.adminId = adminId;
  }
  set color(color: string | null) {
    this.props.color = color;
  }
  set clientId(clientId: string) {
    this.props.clientId = clientId;
  }
  set groupId(groupId: string) {
    this.props.groupId = groupId;
  }
  set stageId(stageId: string | null) {
    this.props.stageId = stageId;
  }
  set interest(interest: string | null) {
    this.props.interest = interest;
  }
  set origin(origin: string) {
    this.props.origin = origin;
  }
  set propertyOfInterest(propertyOfInterest: string) {
    this.props.propertyOfInterest = propertyOfInterest;
  }
  set budget(budget: string) {
    this.props.budget = budget;
  }
  set nextContact(nextContact: Date) {
    this.props.nextContact = nextContact;
  }
  set period(period: string) {
    this.props.period = period;
  }
  set tags(tags: string) {
    this.props.tags = tags;
  }
  set notes(notes: string) {
    this.props.notes = notes;
  }
  set dateOfCreation(dateOfCreation: Date) {
    this.props.dateOfCreation = dateOfCreation;
  }

  static create(
    props: Optional<RecordProps, "stageId" | "interest">,
    id?: UniqueEntityID,
  ) {
    const record = new Record(
      {
        ...props,
        stageId: props.stageId ?? null,
        interest: props.interest ?? null,
        color: props.color ?? null,
      },
      id,
    );
    return record;
  }
}
