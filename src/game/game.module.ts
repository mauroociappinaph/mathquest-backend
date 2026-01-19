import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { AiModule } from '../ai/ai.module';
import { AudioModule } from '../audio/audio.module';
import { EventsModule } from '../events/events.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { SupabaseModule } from '../supabase/supabase.module';

import { ProgressService } from './progress.service';

@Module({
  imports: [AiModule, AudioModule, EventsModule, ProfilesModule, SupabaseModule],
  controllers: [GameController],
  providers: [GameService, ProgressService],
  exports: [GameService, ProgressService]
})
export class GameModule {}
