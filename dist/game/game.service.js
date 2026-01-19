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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
const ai_provider_interface_1 = require("../ai/interfaces/ai-provider.interface");
const audio_provider_interface_1 = require("../audio/interfaces/audio-provider.interface");
const progress_service_1 = require("./progress.service");
let GameService = class GameService {
    supabaseService;
    aiProvider;
    audioProvider;
    progressService;
    constructor(supabaseService, aiProvider, audioProvider, progressService) {
        this.supabaseService = supabaseService;
        this.aiProvider = aiProvider;
        this.audioProvider = audioProvider;
        this.progressService = progressService;
    }
    async submitAnswer(submitAnswerDto) {
        const { child_id, table, multiplicator, answer } = submitAnswerDto;
        const isCorrect = answer === table * multiplicator;
        const { data, error: childError } = await this.supabaseService
            .getClient()
            .from('profiles')
            .select('full_name, parent_id')
            .eq('id', child_id)
            .single();
        const child = data;
        if (childError)
            throw new common_1.BadRequestException('Niño no encontrado');
        const feedbackText = await this.aiProvider.generateFeedback(child.full_name, isCorrect, table, multiplicator, answer);
        const audioBuffer = await this.audioProvider.generateSpeech(feedbackText);
        const audioBase64 = audioBuffer.toString('base64');
        if (isCorrect) {
            await this.progressService.updateProgress(child_id, table, multiplicator, child.full_name, child.parent_id);
        }
        await this.progressService.recordSession(child_id, isCorrect);
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
    __param(1, (0, common_1.Inject)(ai_provider_interface_1.AI_PROVIDER)),
    __param(2, (0, common_1.Inject)(audio_provider_interface_1.AUDIO_PROVIDER)),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService, Object, Object, progress_service_1.ProgressService])
], GameService);
//# sourceMappingURL=game.service.js.map