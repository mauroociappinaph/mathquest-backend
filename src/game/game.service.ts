import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AiService } from '../ai/ai.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Injectable()
export class GameService {
  constructor(
    private supabaseService: SupabaseService,
    private aiService: AiService,
  ) {}

  async submitAnswer(submitAnswerDto: SubmitAnswerDto) {
    const { child_id, table, multiplicator, answer } = submitAnswerDto;
    const isCorrect = answer === table * multiplicator;

    // 1. Obtener nombre del niño para la IA
    const { data: child, error: childError } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('full_name')
      .eq('id', child_id)
      .single();

    if (childError) throw new BadRequestException('Niño no encontrado');

    // 2. Generar Feedback de IA
    const feedback = await this.aiService.generateFeedback(
      child.full_name,
      isCorrect,
      table,
      multiplicator,
      answer,
    );

    // 3. Actualizar Progreso en DB
    if (isCorrect) {
      // Intentar actualizar o insertar progreso de la tabla
      const { data: tableData } = await this.supabaseService
        .getClient()
        .from('multiplication_tables')
        .select('id')
        .eq('number', table)
        .single();

      if (tableData) {
        await this.supabaseService.getClient().rpc('increment_progress', {
          p_child_id: child_id,
          p_table_id: tableData.id,
        });
      }
    }

    // 4. Registrar en historial de sesión (Game Session)
    await this.supabaseService.getClient().from('game_sessions').insert({
      child_id,
      score: isCorrect ? 10 : 0,
      duration: 10, // Simulado por ahora
      correct_answers: isCorrect ? 1 : 0,
      wrong_answers: isCorrect ? 0 : 1,
    });

    return {
      isCorrect,
      correctAnswer: table * multiplicator,
      feedback,
    };
  }
}
