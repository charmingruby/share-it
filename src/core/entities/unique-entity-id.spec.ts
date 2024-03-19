import { describe, it } from 'vitest';
import { UniqueEntityID } from './unique-entity-id';

describe('Unique Entity Id', () => {
  it('should be able to create a unique entity with custom value', () => {
    const id = new UniqueEntityID('id');

    expect(id.toString()).toEqual('id');
  });
});
