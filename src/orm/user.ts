import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  username: string;

  @Column("text")
  password: string;
}
