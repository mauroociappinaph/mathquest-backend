import { ConfigService } from '@nestjs/config';
export declare class AudioService {
    private configService;
    private readonly logger;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    generateSpeech(text: string): Promise<Buffer>;
}
