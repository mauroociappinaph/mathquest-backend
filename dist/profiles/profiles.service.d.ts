import { Logger } from '@nestjs/common';
import { BaseSupabaseService } from '../supabase/base-supabase.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateChildProfileDto } from './dto';
export declare class ProfilesService extends BaseSupabaseService {
    protected readonly logger: Logger;
    constructor(supabaseService: SupabaseService);
    getParentProfile(userId: string): Promise<any>;
    createChild(parentUid: string, createChildDto: CreateChildProfileDto): Promise<any>;
    getChildren(parentUid: string): Promise<any[]>;
}
