import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { describe, it } from 'vitest';
import { SendNotificationUseCase } from './send-notification';

let inMemoryNotificationRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationRepository);
  });

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      title: 'New notification',
      content: 'Notification content',
      recipientId: '1',
    });

    expect(result.isRight).toBeTruthy();
    expect(inMemoryNotificationRepository.items[0]).toEqual(
      result.value?.notification,
    );
  });
});
