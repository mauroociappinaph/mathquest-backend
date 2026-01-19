import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateChildProfileDto } from './dto/create-child-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private supabaseService: SupabaseService) {}

  async getParentProfile(userId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
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

    const { data, error } = await this.supabaseService
      .getClient()
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

    const { data, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('*')
      .eq('parent_id', parentProfile.id)
      .eq('role', 'child');

    if (error) throw new BadRequestException('Error al obtener perfiles de niños');
    return data;
  }
}
