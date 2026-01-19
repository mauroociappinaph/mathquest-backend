import { Logger } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
export declare abstract class BaseSupabaseService {
    protected readonly supabaseService: SupabaseService;
    protected abstract readonly logger: Logger;
    constructor(supabaseService: SupabaseService);
    protected get client(): import("@supabase/supabase-js").SupabaseClient<any, any, any, any, any>;
    protected handleError(error: unknown, message: string): void;
}
