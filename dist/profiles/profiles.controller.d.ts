import { Request } from 'express';
import { ProfilesService } from './profiles.service';
import { CreateChildProfileDto } from './dto/create-child-profile.dto';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    getProfile(req: Request): Promise<any>;
    createChild(req: Request, createChildDto: CreateChildProfileDto): Promise<any>;
    getChildren(req: Request): Promise<any[]>;
}
