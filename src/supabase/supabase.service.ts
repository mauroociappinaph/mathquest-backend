import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabaseClient: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('SUPABASE_URL o SUPABASE_ANON_KEY no están definidos');
      return;
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  getClient() {
    return this.supabaseClient;
  }
}
