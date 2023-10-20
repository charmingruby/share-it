import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repositories'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentRepository
let sut: CommentOnAnswerUseCase

describe('Comment On Answer Use Case', async () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentRepository()
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on a answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      content: 'Testing comment',
      authorId: answer.authorId.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      'Testing comment',
    )
  })
})
