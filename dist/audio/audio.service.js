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
var AudioService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let AudioService = AudioService_1 = class AudioService {
    configService;
    logger = new common_1.Logger(AudioService_1.name);
    baseUrl = 'https://api.elevenlabs.io/v1/text-to-speech';
    constructor(configService) {
        this.configService = configService;
    }
    async generateSpeech(text) {
        const apiKey = this.configService.get('ELEVENLABS_API_KEY');
        const voiceId = '21m00Tcm4TlvDq8ikWAM';
        if (!apiKey) {
            this.logger.warn('ElevenLabs API Key no configurada, devolviendo buffer vacío');
            return Buffer.alloc(0);
        }
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/${voiceId}`, {
                text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                },
            }, {
                headers: {
                    'xi-api-key': apiKey,
                    accept: 'audio/mpeg',
                },
                responseType: 'arraybuffer',
            });
            return Buffer.from(response.data);
        }
        catch (error) {
            this.logger.error('Error al generar audio con ElevenLabs', error);
            return Buffer.alloc(0);
        }
    }
};
exports.AudioService = AudioService;
exports.AudioService = AudioService = AudioService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AudioService);
//# sourceMappingURL=audio.service.js.map