import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { AiProvider } from './interfaces/ai-provider.interface';

@Injectable()
export class AiService implements AiProvider {
  private openai: OpenAI;
  private readonly logger = new Logger(AiService.name);
  private readonly defaultModel = 'mistralai/mistral-nemo';

  constructor(private configService: ConfigService) {
    const openRouterKey = this.configService.get<string>('OPENROUTER_API_KEY');

    if (openRouterKey) {
      this.openai = new OpenAI({
        apiKey: openRouterKey,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': 'https://mathquest-backend.dev',
          'X-Title': 'MathQuest Backend',
        },
      });
    }
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
          model: this.defaultModel,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 100,
        });

        return (
          response.choices[0]?.message?.content?.trim() ||
          (isCorrect ? '¡Excelente trabajo!' : '¡Sigue practicando!')
        );
      }
      return isCorrect
        ? '¡Excelente trabajo! ¡Sigue así!'
        : '¡Casi lo logras! ¡Sigue practicando!';
    } catch (error) {
      this.logger.error('Error al generar feedback con OpenRouter', error);
      return isCorrect ? '¡Muy bien!' : '¡Sigue intentando!';
    }
  }
}
