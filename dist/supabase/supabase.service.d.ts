import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    private configService;
    private supabaseClient;
    private readonly logger;
    constructor(configService: ConfigService);
    getClient(): SupabaseClient<any, any, any, any, any>;
}
