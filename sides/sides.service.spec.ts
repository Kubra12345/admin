import { Test, TestingModule } from '@nestjs/testing';
import { SidesService } from './sides.service';

describe('SidesService', () => {
  let service: SidesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SidesService],
    }).compile();

    service = module.get<SidesService>(SidesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
