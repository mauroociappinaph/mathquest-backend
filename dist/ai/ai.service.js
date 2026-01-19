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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let AiService = AiService_1 = class AiService {
    configService;
    openai;
    logger = new common_1.Logger(AiService_1.name);
    defaultModel = 'mistralai/mistral-nemo';
    constructor(configService) {
        this.configService = configService;
        const openRouterKey = this.configService.get('OPENROUTER_API_KEY');
        if (openRouterKey) {
            this.openai = new openai_1.default({
                apiKey: openRouterKey,
                baseURL: 'https://openrouter.ai/api/v1',
                defaultHeaders: {
                    'HTTP-Referer': 'https://mathquest-backend.dev',
                    'X-Title': 'MathQuest Backend',
                },
            });
        }
    }
    async generateFeedback(childName, isCorrect, table, multiplicator, answer) {
        const prompt = `Actúa como un tutor de matemáticas amigable y motivador para un niño de 7-9 años llamado ${childName}.
    El niño acaba de resolver la operación ${table} x ${multiplicator}.
    Su respuesta fue: ${answer}.
    ¿Fue correcta? ${isCorrect ? 'SÍ' : 'NO'}.

    Proporciona un mensaje corto, divertido y alentador (máximo 2 frases).
    Si fue correcta, felicítalo efusivamente.
    Si fue incorrecta, anímalo a intentarlo de nuevo sin hacerlo sentir mal.`;
        try {
            if (this.openai) {
                const response = await this.openai.chat.completions.create({
                    model: this.defaultModel,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 100,
                });
                return (response.choices[0]?.message?.content?.trim() ||
                    (isCorrect ? '¡Excelente trabajo!' : '¡Sigue practicando!'));
            }
            return isCorrect ? '¡Excelente trabajo! ¡Sigue así!' : '¡Casi lo logras! ¡Sigue practicando!';
        }
        catch (error) {
            this.logger.error('Error al generar feedback con OpenRouter', error);
            return isCorrect ? '¡Muy bien!' : '¡Sigue intentando!';
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map