import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDiagramaDto {
  @ApiProperty({
    example: `Diagrama 1`,
    type: String,
    description: 'Nombre del diagrama',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    example: `2024-05-03`,
    type: Date,
    description: 'Fecha de Creación del diagrama',
  })
  @IsNotEmpty()
  @IsDate()
  fecha: Date;

  @ApiProperty({
    example: `{ key: 1, name: "BankAccount", attributes: [ { name: "owner", type: "String", visibility: "public" }, { name: "balance", type: "Currency", visibility: "public", default: "0" } ] }`,
    type: String,
    description: 'String del array de las clases de la BD',
  })
  @IsNotEmpty()
  @IsString()
  nodos: string;

  @ApiProperty({
    example: `{ from: 14, to: 13, relationship: "Association", text: "0..N", toText: "1" }`,
    type: String,
    description: 'String del array de las relaciones de la BD',
  })
  @IsNotEmpty()
  @IsString()
  links: string;

  @ApiProperty({
    example: true,
    type: Boolean,
    description: 'Si esta eliminado',
  })
  @Optional()  
  isDeleted?: boolean;

  @ApiProperty({
    example: 'adfa-adsfa-asdfa-adaa',
    type: String, 
    description: 'ID del usuario creador del diagrama',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  usuario?: string;

}
