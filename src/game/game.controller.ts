import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GameService } from './game.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';

@ApiTags('Game')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('submit-answer')
  @ApiOperation({ summary: 'Enviar respuesta a un problema de multiplicación' })
  submitAnswer(@Body() submitAnswerDto: SubmitAnswerDto) {
    return this.gameService.submitAnswer(submitAnswerDto);
  }
}
