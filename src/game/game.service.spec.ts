import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { SupabaseService } from '../supabase/supabase.service';
import { AiService } from '../ai/ai.service';
import { AudioService } from '../audio/audio.service';
import { EventsGateway } from '../events/events.gateway';
import { BadRequestException } from '@nestjs/common';

describe('GameService', () => {
  let service: GameService;
  let supabaseService: any;
  let aiService: any;
  let audioService: any;
  let eventsGateway: any;

  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    insert: jest.fn().mockResolvedValue({ error: null }),
    rpc: jest.fn().mockResolvedValue({ error: null }),
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
          provide: AiService,
          useValue: { generateFeedback: jest.fn().mockResolvedValue('Buen trabajo') },
        },
        {
          provide: AudioService,
          useValue: { generateSpeech: jest.fn().mockResolvedValue(Buffer.from('audio')) },
        },
        {
          provide: EventsGateway,
          useValue: { emitProgressUpdate: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
    aiService = module.get<AiService>(AiService);
    audioService = module.get<AudioService>(AudioService);
    eventsGateway = module.get<EventsGateway>(EventsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should submit an answer and return feedback', async () => {
    mockSupabaseClient.single.mockResolvedValueOnce({
      data: { full_name: 'Mauro', parent_id: 'parent-123' },
      error: null
    }); // Profile
    mockSupabaseClient.single.mockResolvedValueOnce({
      data: { id: 'table-1' },
      error: null
    }); // Table

    const result = await service.submitAnswer({
      child_id: 'child-123',
      table: 2,
      multiplicator: 2,
      answer: 4,
    });

    expect(result.isCorrect).toBe(true);
    expect(result.feedback.text).toBe('Buen trabajo');
    expect(result.feedback.audio).toBeDefined();
    expect(eventsGateway.emitProgressUpdate).toHaveBeenCalled();
  });

  it('should throw error if child is not found', async () => {
    mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });

    await expect(service.submitAnswer({
      child_id: 'none',
      table: 2,
      multiplicator: 2,
      answer: 4,
    })).rejects.toThrow(BadRequestException);
  });
});
