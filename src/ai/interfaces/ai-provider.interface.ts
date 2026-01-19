export interface AiProvider {
  generateFeedback(
    childName: string,
    isCorrect: boolean,
    table: number,
    multiplicator: number,
    answer: number,
  ): Promise<string>;
}

export const AI_PROVIDER = 'AI_PROVIDER';
