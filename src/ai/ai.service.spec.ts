import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

jest.mock('openai');

describe('AiService', () => {
  let service: AiService;
  let configService: ConfigService;

  const mockOpenAI = {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    (OpenAI as any).mockImplementation(() => mockOpenAI);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock-api-key'),
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate friendly feedback for a correct answer', async () => {
    const mockResponse = {
      choices: [{ message: { content: '¡Excelente trabajo, Mauro!' } }],
    };
    mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

    const result = await service.generateFeedback('Mauro', true, 5, 5, 25);

    expect(result).toBe('¡Excelente trabajo, Mauro!');
    expect(mockOpenAI.chat.completions.create).toHaveBeenCalled();
  });

  it('should return fallback message on error', async () => {
    mockOpenAI.chat.completions.create.mockRejectedValue(new Error('API Error'));

    const result = await service.generateFeedback('Mauro', false, 5, 5, 10);

    expect(result).toBe('¡Sigue intentando!');
  });
});
