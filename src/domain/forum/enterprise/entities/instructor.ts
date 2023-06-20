import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface InstructorProps {
  name: string
}

export class Intructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id: UniqueEntityID) {
    const answer = new Intructor(props, id)

    return answer
  }
}
