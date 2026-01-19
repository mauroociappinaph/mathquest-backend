import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { BaseSupabaseService } from '../supabase/base-supabase.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateChildProfileDto } from './dto';

@Injectable()
export class ProfilesService extends BaseSupabaseService {
  protected readonly logger = new Logger(ProfilesService.name);

  constructor(supabaseService: SupabaseService) {
    super(supabaseService);
  }

  async getParentProfile(userId: string) {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('uid', userId)
      .single();

    if (error) throw new BadRequestException('Error al obtener perfil del padre');
    return data;
  }

  async createChild(parentUid: string, createChildDto: CreateChildProfileDto) {
    // Primero obtenemos el ID interno del perfil del padre
    const parentProfile = await this.getParentProfile(parentUid);

    const { data, error } = await this.client
      .from('profiles')
      .insert({
        full_name: createChildDto.full_name,
        avatar_url: createChildDto.avatar_url,
        role: 'child',
        parent_id: parentProfile.id,
      })
      .select()
      .single();

    if (error) throw new BadRequestException('Error al crear perfil del niño');
    return data;
  }

  async getChildren(parentUid: string) {
    const parentProfile = await this.getParentProfile(parentUid);

    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('parent_id', parentProfile.id)
      .eq('role', 'child');

    if (error) throw new BadRequestException('Error al obtener perfiles de niños');
    return data;
  }
}
