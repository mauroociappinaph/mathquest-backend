import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AI_PROVIDER } from './interfaces/ai-provider.interface';

@Module({
  providers: [
    {
      provide: AI_PROVIDER,
      useClass: AiService,
    },
  ],
  exports: [AI_PROVIDER],
})
export class AiModule {}
