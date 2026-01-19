import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { AudioProvider } from './interfaces/audio-provider.interface';

@Injectable()
export class AudioService implements AudioProvider {
  private readonly logger = new Logger(AudioService.name);
  private readonly baseUrl = 'https://api.elevenlabs.io/v1/text-to-speech';

  constructor(private configService: ConfigService) {}

  async generateSpeech(text: string): Promise<Buffer> {
    const apiKey = this.configService.get<string>('ELEVENLABS_API_KEY');
    const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel voice - Personalizable

    if (!apiKey) {
      this.logger.warn('ElevenLabs API Key no configurada, devolviendo buffer vacío');
      return Buffer.alloc(0);
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/${voiceId}`,
        {
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        },
        {
          headers: {
            'xi-api-key': apiKey,
            accept: 'audio/mpeg',
          },
          responseType: 'arraybuffer',
        },
      );

      return Buffer.from(response.data);
    } catch (error) {
      this.logger.error('Error al generar audio con ElevenLabs', error);
      return Buffer.alloc(0);
    }
  }
}
