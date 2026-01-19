import { ConfigService } from '@nestjs/config';
import { AudioProvider } from './interfaces/audio-provider.interface';
export declare class AudioService implements AudioProvider {
    private configService;
    private readonly logger;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    generateSpeech(text: string): Promise<Buffer>;
}
