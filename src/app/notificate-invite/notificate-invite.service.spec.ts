import { Test, TestingModule } from '@nestjs/testing';
import { NotificateInviteService } from './notificate-invite.service';

describe('NotificateInviteService', () => {
  let service: NotificateInviteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificateInviteService],
    }).compile();

    service = module.get<NotificateInviteService>(NotificateInviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
