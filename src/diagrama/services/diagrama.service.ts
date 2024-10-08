import { Repository } from 'typeorm';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as qr from 'qrcode';

import { handlerError } from '../../common/utils/handlerError.utils';
import { QueryDto } from '../../common/dto/query.dto';
import { ResponseMessage } from '../../common/interfaces/responseMessage.interface';

import { CreateDiagramaDto, UpdateDiagramaDto } from '../dto';
import { DiagramaEntity } from '../entities/diagrama.entity';
import { ESTADO } from 'src/common/constants/estado';
import { InvitacionEntity } from '../entities/invitacion.entity';
import { UserService } from 'src/user/services/user.service';
import { EnvConfig } from 'src/config/app.config';

@Injectable()
export class DiagramaService {
  private readonly logger = new Logger('DiagramaService');

  constructor(
    @InjectRepository(DiagramaEntity) private readonly diagramaRepository: Repository<DiagramaEntity>,
    @InjectRepository(InvitacionEntity) private readonly invitacionRepository: Repository<InvitacionEntity>,
    private readonly userService: UserService
  ) { }

  public async findAll(queryDto: QueryDto): Promise<DiagramaEntity[]> {
    try {
      const { limit, offset, order, attr, value } = queryDto;
      const query = this.diagramaRepository.createQueryBuilder('diagrama');
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order) query.orderBy('diagrama.createdAt', order.toLocaleUpperCase() as any);
      if (attr && value) query.where(`diagrama.${attr} ILIKE :value`, { value: `%${value}%` });
      return await query.getMany();
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async createDiagram(createDiagramaDto: CreateDiagramaDto, userId: string): Promise<DiagramaEntity> {
    try {
        const { usuario, ...rest } = createDiagramaDto;
        const user = await this.userService.findOne(userId);
        const diagrama = this.diagramaRepository.create({
            ...rest,
            usuario: { id: user.id },
        })
      const diagramaCreated = await this.diagramaRepository.save(diagrama);
      return diagramaCreated;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<DiagramaEntity> {
    try {
      const diagrama: DiagramaEntity = await this.diagramaRepository.findOne({ where: { id }, relations: [ 'usuario' ] });
      if (!diagrama) throw new NotFoundException('Diagrama no encontrado.');
      return diagrama;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findInvitacion(id: string): Promise<InvitacionEntity> {
    try {
      const invitacion: InvitacionEntity = await this.invitacionRepository.findOne({ where: { id } });
      if (!invitacion) throw new NotFoundException('Invitacion no encontrada.');
      return invitacion;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(id: string, updateDiagramaDto: UpdateDiagramaDto,): Promise<DiagramaEntity> {
    try {
        const { usuario, ...rest } = updateDiagramaDto;
      const diagrama: DiagramaEntity = await this.findOne(id);
      const diagramaUpdated = await this.diagramaRepository.update(diagrama.id, rest);
      if (diagramaUpdated.affected === 0) throw new NotFoundException('Diagrama no actualizado.');
      return await this.findOne(id);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async updateInvitacion(id: string): Promise<boolean> {
    try {
      const invitacion: InvitacionEntity = await this.findInvitacion(id);
      const invitacionUpdated = await this.invitacionRepository.update(invitacion.id, { estado: ESTADO.ACEPTADO});
      if (invitacionUpdated.affected === 0) throw new NotFoundException('Diagrama no actualizado.');
      return true;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async delete(id: string): Promise<ResponseMessage> {
    try {
      const diagrama = await this.findOne(id);
      const deletedDiagrama = await this.diagramaRepository.update(diagrama.id, { isDeleted: true });
      if (deletedDiagrama.affected === 0) throw new BadRequestException('Usuario no eliminado.');
      return { statusCode: 200, message: 'Usuario eliminado.' };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async isCreador(id: string) {
    try{
        const diagrama: DiagramaEntity = await this.diagramaRepository.findOne({ where: { usuario: { id } } });
        return diagrama ? true : false;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findByCreador(id: string) {
    try{
        const diagramas: DiagramaEntity[] = await this.diagramaRepository.find({ where: { usuario: { id }, isDeleted: false } });
        return diagramas;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findDiagramaByInvitacionUser(id: string): Promise<DiagramaEntity[]> {
    try {
        const diagramas: DiagramaEntity[] = await this.diagramaRepository.find(
          { where: { invitacion: { estado: ESTADO.ACEPTADO , usuario: { id } }, isDeleted: false }, relations: ['usuario'] }
        );
        this.logger.log(diagramas);
      return diagramas;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async invitar(userId: string, diagramaId: string){
    try {
        const invitacion = this.invitacionRepository.create({
            fecha: new Date(Date.now()),
            estado: ESTADO.PENDIENTE,
            usuario: { id: userId },
            diagrama: { id: diagramaId }
        });
        const invitacionCreated: InvitacionEntity = await this.invitacionRepository.save(invitacion);
        return invitacionCreated;
    } catch (error) {
        handlerError(error, this.logger);
    }
  }

  public async invitarByEmail(email: string, diagramaId: string){
    try {
        const user = await this.userService.findOneBy({key: 'email', value: email});
        if(!user) throw new NotFoundException('Usuario no encontrado.'); 
        const invitacion = await this.invitacionRepository.create({
            fecha: new Date(Date.now()),
            estado: ESTADO.PENDIENTE,
            usuario: { id: user.id },
            diagrama: { id: diagramaId }
        });
        const invitacionCreated: InvitacionEntity = await this.invitacionRepository.save(invitacion);
        return invitacionCreated;
    } catch (error) {
        handlerError(error, this.logger);
    }
  }

  public async findInvitacionesByUser(userId: string): Promise<InvitacionEntity[]> {
    try{
        const invitacion: InvitacionEntity[] = await this.invitacionRepository.find({ where: { usuario: { id: userId }, estado: ESTADO.PENDIENTE }, relations: ['diagrama','diagrama.usuario'] });
        return invitacion;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async invitarQR(idDiagrama: string): Promise<any> {
    const data = EnvConfig().FRONTEND_URL + "/auth/invitacion-qr/" + idDiagrama;
    const qrCodeImage = await qr.toDataURL(data);
    return qrCodeImage;
  }
}
