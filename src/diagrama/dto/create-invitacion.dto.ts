import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ESTADO } from 'src/common/constants/estado';

export class CreateInvitacionDto {
  @ApiProperty({
    example: '2024-01-01',
    type: Date,
    description: 'Fecha de creacion de la fecha',
  })
  @IsNotEmpty()
  @IsDate()
  fecha: Date;

  @ApiProperty({
    example: `{ from: 14, to: 13, relationship: "Association", text: "0..N", toText: "1" }`,
    type: String,
    description: 'String del array de las relaciones de la BD',
  })  
  @IsEnum(ESTADO)
  estado: ESTADO;

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
    description: 'ID del usuario',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  usuario: string;

  @ApiProperty({
    example: 'adfa-adsfa-asdfa-adaa',
    type: String, 
    description: 'ID del diagrama',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  diagrama: string;
}
