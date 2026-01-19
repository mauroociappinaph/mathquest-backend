import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AiService } from '../ai/ai.service';
import { AudioService } from '../audio/audio.service';
import { EventsGateway } from '../events/events.gateway';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Injectable()
export class GameService {
  constructor(
    private supabaseService: SupabaseService,
    private aiService: AiService,
    private audioService: AudioService,
    private eventsGateway: EventsGateway,
  ) {}

  async submitAnswer(submitAnswerDto: SubmitAnswerDto) {
    const { child_id, table, multiplicator, answer } = submitAnswerDto;
    const isCorrect = answer === table * multiplicator;

    // 1. Obtener datos del niño y padre
    const { data: child, error: childError } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('full_name, parent_id')
      .eq('id', child_id)
      .single();

    if (childError) throw new BadRequestException('Niño no encontrado');

    // 2. Generar Feedback de IA
    const feedbackText = await this.aiService.generateFeedback(
      child.full_name,
      isCorrect,
      table,
      multiplicator,
      answer,
    );

    // 3. Generar Audio Feedback (Opcional, no bloqueante para la respuesta rápida)
    const audioBuffer = await this.audioService.generateSpeech(feedbackText);
    const audioBase64 = audioBuffer.toString('base64');

    // 4. Actualizar Progreso en DB
    if (isCorrect) {
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

        // Notificar al padre vía WebSockets
        this.eventsGateway.emitProgressUpdate(child.parent_id, {
          childName: child.full_name,
          table,
          multiplicator,
          timestamp: new Date(),
        });
      }
    }

    // 5. Registrar en historial de sesión
    await this.supabaseService.getClient().from('game_sessions').insert({
      child_id,
      score: isCorrect ? 10 : 0,
      duration: 10,
      correct_answers: isCorrect ? 1 : 0,
      wrong_answers: isCorrect ? 0 : 1,
    });

    return {
      isCorrect,
      correctAnswer: table * multiplicator,
      feedback: {
        text: feedbackText,
        audio: audioBase64,
      },
    };
  }
}
