import { SupabaseService } from '../supabase/supabase.service';
import { CreateChildProfileDto } from './dto/create-child-profile.dto';
export declare class ProfilesService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    getParentProfile(userId: string): Promise<any>;
    createChild(parentUid: string, createChildDto: CreateChildProfileDto): Promise<any>;
    getChildren(parentUid: string): Promise<any[]>;
}
