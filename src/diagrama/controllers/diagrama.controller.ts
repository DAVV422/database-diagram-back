import { Body, Controller, Get, Delete, Param, UseGuards, ParseUUIDPipe, Query, Patch, Post, } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger/dist';

import { AuthGuard, RolesGuard } from '../../auth/guards/';
import { UpdateDiagramaDto } from '../dto/update-diagram.dto';
import { DiagramaService } from '../services/diagrama.service';
import { QueryDto } from '../../common/dto/query.dto';
import { ResponseMessage } from 'src/common/interfaces/responseMessage.interface';
import { CreateDiagramaDto } from '../dto';

@ApiTags('Diagrama')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('diagrama')
export class DiagramaController {
  constructor(private readonly diagramaService: DiagramaService) { }

  @ApiParam({ name: 'id', type: 'string'})
  @Get(':id')
  public async findCreados(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.diagramaService.findByCreador(id),
    };
  }
  
  @Post()
  public async createDiagram(@Body() createDiagram: CreateDiagramaDto): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.diagramaService.createDiagram(createDiagram),
    };
  }

  @ApiParam({ name: 'userId', type: 'string'})
  @Get('/byinvitacion/:userId')
  public async findbyInvitaciones(@Param('userId', ParseUUIDPipe) id: string): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.diagramaService.findDiagramaByInvitacionUser(id),
    };
  }

  @ApiParam({ name: 'userId', type: 'string'})
  @Get('created/:userId')
  public async finbyCreated(@Param('userId', ParseUUIDPipe) id: string): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.diagramaService.findByCreador(id),
    };
  }

  //obtener invitaciones
  @ApiParam({ name: 'userId', type: 'string'})
  @Get('invitaciones/:userId')
  public async findInvitaciones(@Param('userId', ParseUUIDPipe) id: string): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.diagramaService.findInvitacionesByUser(id),
    };
  }

  //invitar
  @ApiParam({ name: 'userId', type: 'string'})
  @ApiParam({ name: 'diagramaId', type: 'string'})
  @Post('invitacion')
  public async invitar(
    @Param('userId', ParseUUIDPipe) userId: string, 
    @Param('diagramaId', ParseUUIDPipe) diagramaId: string
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.diagramaService.invitar(userId, diagramaId),
    };
  }

  //encontrar un diagrama
  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id')
  public async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.diagramaService.findOne(id),
    }
  }

  //Actualizar un diagrama
  @ApiParam({ name: 'id', type: 'string' })
  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDiagramaDto: UpdateDiagramaDto): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.diagramaService.update(id, updateDiagramaDto),
    };
  }

  //Eliminar un diagrama
  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseMessage> {
    return await this.diagramaService.delete(id);
  }
}
