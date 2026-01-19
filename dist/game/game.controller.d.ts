import { GameService } from './game.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    submitAnswer(submitAnswerDto: SubmitAnswerDto): Promise<{
        isCorrect: boolean;
        correctAnswer: number;
        feedback: {
            text: string;
            audio: string;
        };
    }>;
}
