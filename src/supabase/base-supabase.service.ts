import { Logger } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

export abstract class BaseSupabaseService {
  protected abstract readonly logger: Logger;

  constructor(protected readonly supabaseService: SupabaseService) {}

  protected get client() {
    return this.supabaseService.getClient();
  }

  protected handleError(error: any, message: string) {
    this.logger.error(`${message}: ${error.message || error}`, error.stack);
    throw error;
  }
}
