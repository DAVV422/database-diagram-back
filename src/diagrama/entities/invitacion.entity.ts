import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';

import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { DiagramaEntity } from './diagrama.entity';
import { ESTADO } from '../../common/constants/estado';

@Entity({ name: 'invitacion' })
export class InvitacionEntity extends BaseEntity {
  @Column()
  fecha: Date;

  @Column()
  estado: ESTADO;

  @ManyToOne(() => UserEntity, (user) => user.invitaciones)
  usuario: UserEntity;

  @ManyToOne(() => DiagramaEntity, (diagrama) => diagrama.invitacion)
  diagrama: DiagramaEntity;
}
