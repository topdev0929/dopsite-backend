import { Test, TestingModule } from '@nestjs/testing';
import { NotificateInviteController } from './notificate-invite.controller';

describe('NotificateInvite Controller', () => {
  let controller: NotificateInviteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificateInviteController],
    }).compile();

    controller = module.get<NotificateInviteController>(NotificateInviteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
