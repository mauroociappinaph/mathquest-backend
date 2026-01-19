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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
const ai_service_1 = require("../ai/ai.service");
const audio_service_1 = require("../audio/audio.service");
const events_gateway_1 = require("../events/events.gateway");
let GameService = class GameService {
    supabaseService;
    aiService;
    audioService;
    eventsGateway;
    constructor(supabaseService, aiService, audioService, eventsGateway) {
        this.supabaseService = supabaseService;
        this.aiService = aiService;
        this.audioService = audioService;
        this.eventsGateway = eventsGateway;
    }
    async submitAnswer(submitAnswerDto) {
        const { child_id, table, multiplicator, answer } = submitAnswerDto;
        const isCorrect = answer === table * multiplicator;
        const { data: child, error: childError } = await this.supabaseService
            .getClient()
            .from('profiles')
            .select('full_name, parent_id')
            .eq('id', child_id)
            .single();
        if (childError)
            throw new common_1.BadRequestException('Niño no encontrado');
        const feedbackText = await this.aiService.generateFeedback(child.full_name, isCorrect, table, multiplicator, answer);
        const audioBuffer = await this.audioService.generateSpeech(feedbackText);
        const audioBase64 = audioBuffer.toString('base64');
        if (isCorrect) {
            const { data: tableData } = await this.supabaseService
                .getClient()
                .from('multiplication_tables')
                .select('id')
                .eq('number', table)
                .single();
            if (tableData) {
                await this.supabaseService.getClient().rpc('increment_progress', {
                    p_child_id: child_id,
                    p_table_id: tableData.id,
                });
                this.eventsGateway.emitProgressUpdate(child.parent_id, {
                    childName: child.full_name,
                    table,
                    multiplicator,
                    timestamp: new Date(),
                });
            }
        }
        await this.supabaseService.getClient().from('game_sessions').insert({
            child_id,
            score: isCorrect ? 10 : 0,
            duration: 10,
            correct_answers: isCorrect ? 1 : 0,
            wrong_answers: isCorrect ? 0 : 1,
        });
        return {
            isCorrect,
            correctAnswer: table * multiplicator,
            feedback: {
                text: feedbackText,
                audio: audioBase64,
            },
        };
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        ai_service_1.AiService,
        audio_service_1.AudioService,
        events_gateway_1.EventsGateway])
], GameService);
//# sourceMappingURL=game.service.js.map