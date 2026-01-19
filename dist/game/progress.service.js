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
var ProgressService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const base_supabase_service_1 = require("../supabase/base-supabase.service");
const supabase_service_1 = require("../supabase/supabase.service");
const events_gateway_1 = require("../events/events.gateway");
let ProgressService = ProgressService_1 = class ProgressService extends base_supabase_service_1.BaseSupabaseService {
    eventsGateway;
    logger = new common_1.Logger(ProgressService_1.name);
    constructor(supabaseService, eventsGateway) {
        super(supabaseService);
        this.eventsGateway = eventsGateway;
    }
    async updateProgress(childId, table, multiplicator, childName, parentId) {
        const { data, error: tableError } = await this.client
            .from('multiplication_tables')
            .select('id')
            .eq('number', table)
            .single();
        if (tableError)
            return;
        const tableData = data;
        if (tableData) {
            await this.client.rpc('increment_progress', {
                p_child_id: childId,
                p_table_id: tableData.id,
            });
            this.eventsGateway.emitProgressUpdate(parentId, {
                childName,
                table,
                multiplicator,
                timestamp: new Date(),
            });
        }
    }
    async recordSession(childId, isCorrect) {
        await this.client.from('game_sessions').insert({
            child_id: childId,
            score: isCorrect ? 10 : 0,
            duration: 10,
            correct_answers: isCorrect ? 1 : 0,
            wrong_answers: isCorrect ? 0 : 1,
        });
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = ProgressService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        events_gateway_1.EventsGateway])
], ProgressService);
//# sourceMappingURL=progress.service.js.map