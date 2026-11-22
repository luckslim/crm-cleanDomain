import { Entity } from "@/core/entity";
import type { Optional } from "@/core/types/optional";
import type { UniqueEntityID } from "@/core/unique-entityId";

export interface RecordProps {
  adminId: string;
  clientId: string;
  type: string;
  stage: string | null; //optional
  interest: string | null; //optional
  origin: string;
  propertyOfInterest: string;
  budget: string;
  nextContact: Date;
  period: string;
  tags: string;
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
  get type() {
    return this.props.type;
  }
  get stage() {
    return this.props.stage;
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
  set clientId(clientId: string) {
    this.props.clientId = clientId;
  }
  set type(type: string) {
    this.props.type = type;
  }
  set stage(stage: string | null) {
    this.props.stage = stage;
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
    props: Optional<RecordProps, "stage" | "interest">,
    id?: UniqueEntityID,
  ) {
    const record = new Record(
      {
        ...props,
        stage: props.stage ?? null,
        interest: props.interest ?? null,
      },
      id,
    );
    return record;
  }
}
