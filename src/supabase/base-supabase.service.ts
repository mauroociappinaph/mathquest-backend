import { Logger } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

export abstract class BaseSupabaseService {
  protected abstract readonly logger: Logger;

  constructor(protected readonly supabaseService: SupabaseService) {}

  protected get client() {
    return this.supabaseService.getClient();
  }

  protected handleError(error: unknown, message: string) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';
    this.logger.error(`${message}: ${errorMessage}`, errorStack);
    throw error;
  }
}
