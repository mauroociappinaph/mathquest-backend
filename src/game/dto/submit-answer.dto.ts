import { IsNumber, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAnswerDto {
  @ApiProperty({ example: 'child-uuid' })
  @IsUUID()
  @IsNotEmpty()
  child_id: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @IsNotEmpty()
  table: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsNotEmpty()
  multiplicator: number;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @IsNotEmpty()
  answer: number;
}
