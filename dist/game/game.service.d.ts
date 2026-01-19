import { SupabaseService } from '../supabase/supabase.service';
import { AiService } from '../ai/ai.service';
import { AudioService } from '../audio/audio.service';
import { EventsGateway } from '../events/events.gateway';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
export declare class GameService {
    private supabaseService;
    private aiService;
    private audioService;
    private eventsGateway;
    constructor(supabaseService: SupabaseService, aiService: AiService, audioService: AudioService, eventsGateway: EventsGateway);
    submitAnswer(submitAnswerDto: SubmitAnswerDto): Promise<{
        isCorrect: boolean;
        correctAnswer: number;
        feedback: {
            text: string;
            audio: string;
        };
    }>;
}
