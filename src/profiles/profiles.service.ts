import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
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

@Injectable()
export class ProfilesService extends BaseSupabaseService {
  protected readonly logger = new Logger(ProfilesService.name);

  constructor(supabaseService: SupabaseService) {
    super(supabaseService);
  }

  async getParentProfile(userId: string) {
    const response = await this.client
      .from('profiles')
      .select('*')
      .eq('uid', userId)
      .single();

    const { data, error } = response as PostgrestSingleResponse<Profile>;

    if (error)
      throw new BadRequestException('Error al obtener perfil del padre');
    return data;
  }

  async createChild(parentUid: string, createChildDto: CreateChildProfileDto) {
    // Primero obtenemos el ID interno del perfil del padre
    const parentProfile = await this.getParentProfile(parentUid);

    const response = await this.client
      .from('profiles')
      .insert({
        full_name: createChildDto.full_name,
        avatar_url: createChildDto.avatar_url,
        role: 'child',
        parent_id: parentProfile.id,
      })
      .select()
      .single();

    const { data, error } = response as PostgrestSingleResponse<Profile>;

    if (error) throw new BadRequestException('Error al crear perfil del niño');
    return data;
  }

  async getChildren(parentUid: string) {
    const parentProfile = await this.getParentProfile(parentUid);

    const response = await this.client
      .from('profiles')
      .select('*')
      .eq('parent_id', parentProfile.id)
      .eq('role', 'child');

    const { data, error } = response as PostgrestSingleResponse<Profile[]>;

    if (error)
      throw new BadRequestException('Error al obtener perfiles de niños');
    return data;
  }
}
