import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private openai;
    private readonly logger;
    private readonly defaultModel;
    constructor(configService: ConfigService);
    generateFeedback(childName: string, isCorrect: boolean, table: number, multiplicator: number, answer: number): Promise<string>;
}
