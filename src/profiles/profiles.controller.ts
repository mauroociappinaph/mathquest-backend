import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { ProfilesService } from './profiles.service';
import { CreateChildProfileDto } from './dto/create-child-profile.dto';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Profiles')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener mi perfil de padre' })
  @Roles('parent', 'admin')
  getProfile(@Req() req: RequestWithUser) {
    return this.profilesService.getParentProfile(req.user.id);
  }

  @Post('children')
  @ApiOperation({ summary: 'Crear un perfil de niño' })
  @Roles('parent', 'admin')
  createChild(
    @Req() req: RequestWithUser,
    @Body() createChildDto: CreateChildProfileDto,
  ) {
    return this.profilesService.createChild(req.user.id, createChildDto);
  }

  @Get('children')
  @ApiOperation({ summary: 'Listar mis hijos' })
  @Roles('parent', 'admin')
  getChildren(@Req() req: RequestWithUser) {
    return this.profilesService.getChildren(req.user.id);
  }
}
