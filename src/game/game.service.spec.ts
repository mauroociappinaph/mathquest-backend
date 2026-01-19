import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { SupabaseService } from '../supabase/supabase.service';
import { AI_PROVIDER } from '../ai/interfaces/ai-provider.interface';
import { AUDIO_PROVIDER } from '../audio/interfaces/audio-provider.interface';
import { ProgressService } from './progress.service';
import { BadRequestException } from '@nestjs/common';

describe('GameService', () => {
  let service: GameService;
  let supabaseService: any;
  let progressService: any;

  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: SupabaseService,
          useValue: { getClient: () => mockSupabaseClient },
        },
        {
          provide: AI_PROVIDER,
          useValue: { generateFeedback: jest.fn().mockResolvedValue('Buen trabajo') },
        },
        {
          provide: AUDIO_PROVIDER,
          useValue: { generateSpeech: jest.fn().mockResolvedValue(Buffer.from('audio')) },
        },
        {
          provide: ProgressService,
          useValue: { updateProgress: jest.fn(), recordSession: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
    progressService = module.get<ProgressService>(ProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process a correct answer', async () => {
    const dto = { child_id: '123', table: 5, multiplicator: 5, answer: 25 };

    mockSupabaseClient.single.mockResolvedValueOnce({
      data: { full_name: 'Niño', parent_id: 'parent_abc' },
      error: null
    });

    const result = await service.submitAnswer(dto);

    expect(result.isCorrect).toBe(true);
    expect(progressService.updateProgress).toHaveBeenCalled();
    expect(progressService.recordSession).toHaveBeenCalledWith('123', true);
  });

  it('should throw error if child not found', async () => {
    const dto = { child_id: 'non-existent', table: 5, multiplicator: 5, answer: 25 };

    mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });

    await expect(service.submitAnswer(dto)).rejects.toThrow(BadRequestException);
  });

  it('should process an incorrect answer', async () => {
    const dto = { child_id: '123', table: 5, multiplicator: 5, answer: 30 }; // 5x5 is 25, so 30 is wrong

    mockSupabaseClient.single.mockResolvedValueOnce({
      data: { full_name: 'Niño', parent_id: 'parent_abc' },
      error: null
    });

    const result = await service.submitAnswer(dto);

    expect(result.isCorrect).toBe(false);
    expect(progressService.updateProgress).not.toHaveBeenCalled();
    expect(progressService.recordSession).toHaveBeenCalledWith('123', false);
  });
});
