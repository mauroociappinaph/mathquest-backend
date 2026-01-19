"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let ProfilesService = class ProfilesService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async getParentProfile(userId) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('profiles')
            .select('*')
            .eq('uid', userId)
            .single();
        if (error)
            throw new common_1.BadRequestException('Error al obtener perfil del padre');
        return data;
    }
    async createChild(parentUid, createChildDto) {
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
        if (error)
            throw new common_1.BadRequestException('Error al crear perfil del niño');
        return data;
    }
    async getChildren(parentUid) {
        const parentProfile = await this.getParentProfile(parentUid);
        const { data, error } = await this.supabaseService
            .getClient()
            .from('profiles')
            .select('*')
            .eq('parent_id', parentProfile.id)
            .eq('role', 'child');
        if (error)
            throw new common_1.BadRequestException('Error al obtener perfiles de niños');
        return data;
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map