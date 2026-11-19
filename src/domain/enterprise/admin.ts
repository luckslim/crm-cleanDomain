import { Entity } from "@/core/entity";
import type { UniqueEntityID } from "@/core/unique-entityId";

export interface AdminProps {
  email: string;
  urlImage: string;
  password: string;
  adminName: string;
  dateOfCreation: Date;
}
export class Admin extends Entity<AdminProps> {
  get email() {
    return this.props.email;
  }
  get urlImage() {
    return this.props.urlImage;
  }
  get password() {
    return this.props.password;
  }
  get adminName() {
    return this.props.adminName;
  }
  get dateOfCreation() {
    return this.props.dateOfCreation;
  }
  set email(email: string) {
    this.props.email = email;
  }
  set password(password: string) {
    this.props.password = password;
  }
  set adminName(adminName: string) {
    this.props.adminName = adminName;
  }
  set urlImage(urlImage: string) {
    this.props.urlImage = urlImage;
  }

  static create(props: AdminProps, id?: UniqueEntityID) {
    const admin = new Admin(props, id);
    return admin;
  }
}
