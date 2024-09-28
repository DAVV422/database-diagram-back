import { PartialType } from '@nestjs/mapped-types';
import { CreateDiagramaDto } from './create-diagram.dto';

export class UpdateDiagramaDto extends PartialType(CreateDiagramaDto) { }