import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  AI_PROVIDER,
  AiProvider,
} from '../ai/interfaces/ai-provider.interface';
import {
  AUDIO_PROVIDER,
  AudioProvider,
} from '../audio/interfaces/audio-provider.interface';
import { ProgressService } from './progress.service';
import { SubmitAnswerDto } from './dto';

interface ChildWithParent {
  full_name: string;
  parent_id: string;
}

@Injectable()
export class GameService {
  constructor(
    private supabaseService: SupabaseService,
    @Inject(AI_PROVIDER) private aiProvider: AiProvider,
    @Inject(AUDIO_PROVIDER) private audioProvider: AudioProvider,
    private progressService: ProgressService,
  ) {}

  async submitAnswer(submitAnswerDto: SubmitAnswerDto) {
    const { child_id, table, multiplicator, answer } = submitAnswerDto;
    const isCorrect = answer === table * multiplicator;

    // 1. Obtener datos del niño y padre
    const { data, error: childError } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('full_name, parent_id')
      .eq('id', child_id)
      .single();

    const child = data as ChildWithParent;

    if (childError) throw new BadRequestException('Niño no encontrado');

    // 2. Generar Feedback de IA
    const feedbackText = await this.aiProvider.generateFeedback(
      child.full_name,
      isCorrect,
      table,
      multiplicator,
      answer,
    );

    // 3. Generar Audio Feedback
    const audioBuffer = await this.audioProvider.generateSpeech(feedbackText);
    const audioBase64 = audioBuffer.toString('base64');

    // 4. Actualizar Progreso y Registrar Sesión (SRP)
    if (isCorrect) {
      await this.progressService.updateProgress(
        child_id,
        table,
        multiplicator,
        child.full_name,
        child.parent_id,
      );
    }

    await this.progressService.recordSession(child_id, isCorrect);

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
