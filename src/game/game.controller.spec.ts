import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';

describe('GameController', () => {
  let controller: GameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useValue: { submitAnswer: jest.fn() },
        },
      ],
    })
    .overrideGuard(SupabaseAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
