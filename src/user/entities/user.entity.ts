import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { Exclude } from 'class-transformer';

import { BaseEntity } from '../../common/entities/base.entity';
import { ROLES } from '../../common/constants';
import { IUser } from '../interfaces/user.interface';
import { DiagramaEntity } from 'src/diagrama/entities/diagrama.entity';
import { InvitacionEntity } from 'src/diagrama/entities/invitacion.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity implements IUser {
  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: ROLES })
  role: ROLES;

  @OneToMany(() => DiagramaEntity, (diagrama) => diagrama.usuario)
  diagramas: DiagramaEntity[];

  @OneToMany(() => InvitacionEntity, (invitacion) => invitacion.usuario)
  invitaciones: InvitacionEntity[];
}
