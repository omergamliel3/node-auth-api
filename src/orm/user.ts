import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user" })
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  username: string;

  @Column("text")
  password: string;
}
