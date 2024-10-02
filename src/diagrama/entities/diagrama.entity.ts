import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { Exclude } from 'class-transformer';

import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { InvitacionEntity } from './invitacion.entity';

@Entity({ name: 'diagrama' })
export class DiagramaEntity extends BaseEntity {
  @Column()
  nombre: string;

  @Column({ nullable: true})
  fecha: Date;

  @Column()
  nodos: string;

  @Column()
  links: string;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => UserEntity, (user) => user.diagramas)
  usuario: UserEntity;

  @OneToMany(() => InvitacionEntity, (invitacion) => invitacion.diagrama)
  invitacion: InvitacionEntity ;
}
