import { Logger } from '@nestjs/common';
import { BaseSupabaseService } from '../supabase/base-supabase.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateChildProfileDto } from './dto';
interface Profile {
    id: string;
    uid: string;
    full_name: string;
    avatar_url: string;
    role: 'parent' | 'child' | 'admin';
    parent_id?: string;
}
export declare class ProfilesService extends BaseSupabaseService {
    protected readonly logger: Logger;
    constructor(supabaseService: SupabaseService);
    getParentProfile(userId: string): Promise<Profile>;
    createChild(parentUid: string, createChildDto: CreateChildProfileDto): Promise<Profile>;
    getChildren(parentUid: string): Promise<Profile[]>;
}
export {};
