import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Column } from "typeorm";

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('tblUsers')
export class UsersEntity {
  @PrimaryGeneratedColumn("identity")
  id: number;

  @Column("varchar", { length: "255", unique: true })
  username: string;

  @Column("varchar", { length: "255" })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn({ type: "timestamptz" })
  dtCreatedAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  dtUpdatedAt: Date;
}

export type TUserEntity = UsersEntity;