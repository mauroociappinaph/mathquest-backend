import { Logger } from '@nestjs/common';
import { BaseSupabaseService } from '../supabase/base-supabase.service';
import { SupabaseService } from '../supabase/supabase.service';
import { EventsGateway } from '../events/events.gateway';
export declare class ProgressService extends BaseSupabaseService {
    private eventsGateway;
    protected readonly logger: Logger;
    constructor(supabaseService: SupabaseService, eventsGateway: EventsGateway);
    updateProgress(childId: string, table: number, multiplicator: number, childName: string, parentId: string): Promise<void>;
    recordSession(childId: string, isCorrect: boolean): Promise<void>;
}
