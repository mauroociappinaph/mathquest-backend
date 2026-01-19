import { ConfigService } from '@nestjs/config';
import { AiProvider } from './interfaces/ai-provider.interface';
export declare class AiService implements AiProvider {
    private configService;
    private openai;
    private readonly logger;
    private readonly defaultModel;
    constructor(configService: ConfigService);
    generateFeedback(childName: string, isCorrect: boolean, table: number, multiplicator: number, answer: number): Promise<string>;
}
