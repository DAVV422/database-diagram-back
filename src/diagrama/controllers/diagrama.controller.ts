import { Body, Controller, Get, Delete, Param, UseGuards, ParseUUIDPipe, Query, Patch, Post, } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger/dist';

import { AuthGuard, RolesGuard } from '../../auth/guards/';
import { UpdateDiagramaDto } from '../dto/update-diagram.dto';
import { DiagramaService } from '../services/diagrama.service';
import { QueryDto } from '../../common/dto/query.dto';
import { ResponseMessage } from './../../common/interfaces/responseMessage.interface';
import { CreateDiagramaDto } from '../dto';
import { GetUser } from './../../auth/decorators';

@ApiTags('Diagrama')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('diagrama')
export class DiagramaController {
  constructor(private readonly diagramaService: DiagramaService) { }

  // @ApiParam({ name: 'id', type: 'string'})
  // @Get(':id')
  // public async findCreados(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseMessage> {
  //   return {
  //     statusCode: 200,
  //     data: await this.diagramaService.findByCreador(id),
  //   };
  // }
  
  @ApiParam({ name: 'userId', type: 'string'})
  @Post(":userId")  
  public async createDiagram(
    @Body() createDiagram: CreateDiagramaDto, 
    @Param('userId', ParseUUIDPipe) userId: string
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.diagramaService.createDiagram(createDiagram, userId),
    };
  }

  @ApiParam({ name: 'userId', type: 'string'})
  @Get('/byinvitacion/:userId')
  public async findbyInvitaciones(@Param('userId', ParseUUIDPipe) userId: string): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.diagramaService.findDiagramaByInvitacionUser(userId),
    };
  }


  @ApiParam({ name: 'userId', type: 'string'})
  @Get('created/:userId')
  public async finbyCreated(@Param('userId', ParseUUIDPipe) userId: string): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.diagramaService.findByCreador(userId),
    };
  }

  //obtener invitaciones  
  @ApiParam({ name: 'userId', type: 'string'})
  @Get('invitaciones/:userId')
  public async findInvitaciones(@Param('userId', ParseUUIDPipe) userId: string,): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.diagramaService.findInvitacionesByUser(userId),
    };
  }


  //invitar
  @ApiParam({ name: 'diagramaId', type: 'string'})
  @Post('invitacionbyemail/:diagramaId')
  public async invitarByEmail(
    @Body('email') email: string, 
    @Param('diagramaId', ParseUUIDPipe) diagramaId: string
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.diagramaService.invitarByEmail(email, diagramaId),
    };
  }

  //invitar
  @ApiParam({ name: 'userId', type: 'string'})
  @ApiParam({ name: 'diagramaId', type: 'string'})
  @Post('invitacion/:userId/:diagramaId')
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

  //Actualizar una invitacion
  @ApiParam({ name: 'id', type: 'string' })
  @Patch('invitacion/:id')
  public async updateInvitacion(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.diagramaService.updateInvitacion(id),
    };
  }

  //Eliminar un diagrama
  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseMessage> {
    return await this.diagramaService.delete(id);
  }

  //invitar by qr
  @ApiParam({ name: 'idDiagrama', type: 'string' })
  @Get('qr/:idDiagrama')
  public async invitarQR(@Param('idDiagrama', ParseUUIDPipe) idDiagrama: string): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.diagramaService.invitarQR(idDiagrama),
    }
  }


}
