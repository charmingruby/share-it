import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityID } from '../entities/unique-entity-id';
import { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';
import { vi } from 'vitest';

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;
  private aggregate: CustomAggregate //eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

    return aggregate;
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn();

    // Registered subscriber (listening to event "event name")
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    // Registering event
    const aggregate = CustomAggregate.create();

    // Asserting the event was NOT DISPATCHED
    expect(aggregate.domainEvents).toHaveLength(1);

    // Saving on database and DISPATCHING the event
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    // Subscriver listen to event and do what is needed
    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
