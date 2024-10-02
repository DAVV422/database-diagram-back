import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DiagramaService } from './services/diagrama.service';
import { DiagramaController } from './controllers/diagrama.controller';
import { DiagramaEntity } from './entities/diagrama.entity';
import { InvitacionEntity } from './entities/invitacion.entity';
import { UserModule } from 'src/user/user.module';
import { DiagramGateway } from './websocket/diagram.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiagramaEntity, InvitacionEntity]),
    UserModule
  ],
  providers: [DiagramaService, DiagramGateway],
  controllers: [DiagramaController],
  exports: [DiagramaService, TypeOrmModule],
})
export class DiagramaModule {}