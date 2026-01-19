import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { SupabaseService } from './supabase/supabase.service';
import { ProfilesModule } from './profiles/profiles.module';
import { GameModule } from './game/game.module';
import { AiService } from './ai/ai.service';
import { AudioModule } from './audio/audio.module';
import { EventsGateway } from './events/events.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    ProfilesModule,
    GameModule,
    AudioModule,
  ],
  controllers: [AppController],
  providers: [AppService, AiService, EventsGateway],
})
export class AppModule {}
