import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChildProfileDto {
  @ApiProperty({ example: 'Pedrito' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'https://example.com/avatar.png', required: false })
  @IsOptional()
  @IsUrl()
  avatar_url?: string;
}
