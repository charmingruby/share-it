import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { describe, it } from 'vitest';
import { ReadNotificationUseCase } from './read-notification';
import { makeNotification } from 'test/factories/make-notification';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryNotificationRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe('Read Notification Use Case', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository);
  });

  it('should be able to read a notification', async () => {
    const notification = makeNotification();

    await inMemoryNotificationRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
    });

    expect(result.isRight).toBeTruthy();
    expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
      expect.any(Date),
    );
  });

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID('recipient-1'),
    });

    await inMemoryNotificationRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: new UniqueEntityID('recipient-2').toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
