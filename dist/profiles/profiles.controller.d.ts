import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { ProfilesService } from './profiles.service';
import { CreateChildProfileDto } from './dto/create-child-profile.dto';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    getProfile(req: RequestWithUser): Promise<any>;
    createChild(req: RequestWithUser, createChildDto: CreateChildProfileDto): Promise<any>;
    getChildren(req: RequestWithUser): Promise<any[]>;
}
