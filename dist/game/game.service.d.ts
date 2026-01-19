import { SupabaseService } from '../supabase/supabase.service';
import { AiProvider } from '../ai/interfaces/ai-provider.interface';
import { AudioProvider } from '../audio/interfaces/audio-provider.interface';
import { ProgressService } from './progress.service';
import { SubmitAnswerDto } from './dto';
export declare class GameService {
    private supabaseService;
    private aiProvider;
    private audioProvider;
    private progressService;
    constructor(supabaseService: SupabaseService, aiProvider: AiProvider, audioProvider: AudioProvider, progressService: ProgressService);
    submitAnswer(submitAnswerDto: SubmitAnswerDto): Promise<{
        isCorrect: boolean;
        correctAnswer: number;
        feedback: {
            text: string;
            audio: string;
        };
    }>;
}
