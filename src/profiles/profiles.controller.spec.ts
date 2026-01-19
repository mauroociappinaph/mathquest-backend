import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service'; // Assuming ProfilesService is in the same directory or needs to be imported
import { SupabaseService } from '../supabase/supabase.service'; // Assuming SupabaseService path

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let service: ProfilesService; // Declare service variable

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController], // Keep controller for controller test
      providers: [
        ProfilesService, // Provide the real ProfilesService
        {
          provide: SupabaseService, // Mock SupabaseService if ProfilesService depends on it
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    service = module.get<ProfilesService>(ProfilesService); // Get the service instance
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add a test for the service if needed, or remove the 'service' variable if not used
  it('ProfilesService should be defined', () => {
    expect(service).toBeDefined();
  });
});
