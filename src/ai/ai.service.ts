import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private anthropic: Anthropic;
  private readonly logger = new Logger(AiService.name);

  constructor(private configService: ConfigService) {
    const openaiKey = this.configService.get<string>('OPENAI_API_KEY');
    const anthropicKey = this.configService.get<string>('CLAUDE_API_KEY');

    if (openaiKey) this.openai = new OpenAI({ apiKey: openaiKey });
    if (anthropicKey) this.anthropic = new Anthropic({ apiKey: anthropicKey });
  }

  async generateFeedback(
    childName: string,
    isCorrect: boolean,
    table: number,
    multiplicator: number,
    answer: number,
  ): Promise<string> {
    const prompt = `Actúa como un tutor de matemáticas amigable y motivador para un niño de 7-9 años llamado ${childName}.
    El niño acaba de resolver la operación ${table} x ${multiplicator}.
    Su respuesta fue: ${answer}.
    ¿Fue correcta? ${isCorrect ? 'SÍ' : 'NO'}.

    Proporciona un mensaje corto, divertido y alentador (máximo 2 frases).
    Si fue correcta, felicítalo efusivamente.
    Si fue incorrecta, anímalo a intentarlo de nuevo sin hacerlo sentir mal.`;

    try {
      if (this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 100,
        });
        return response.choices[0].message.content || (isCorrect ? '¡Excelente!' : '¡Sigue así!');
      } else if (this.anthropic) {
        const response = await this.anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 100,
          messages: [{ role: 'user', content: prompt }],
        });
        return (response.content[0] as any).text;
      }
      return isCorrect ? '¡Excelente trabajo! ¡Sigue así!' : '¡Casi lo logras! ¡Sigue practicando!';
    } catch (error) {
      this.logger.error('Error al generar feedback de IA', error);
      return isCorrect ? '¡Muy bien!' : '¡Sigue intentando!';
    }
  }
}
