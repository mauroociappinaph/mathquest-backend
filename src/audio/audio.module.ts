import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AUDIO_PROVIDER } from './interfaces/audio-provider.interface';

@Module({
  providers: [
    {
      provide: AUDIO_PROVIDER,
      useClass: AudioService,
    },
  ],
  exports: [AUDIO_PROVIDER],
})
export class AudioModule {}
