import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Slug } from './value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '@/domain/notification/enterprise/events/question-best-answer-chose-event'

export interface QuestionProps {
  title: string
  bestAnswerId?: UniqueEntityID
  attachments: QuestionAttachmentList
  content: string
  slug: Slug
  authorId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  get content() {
    return this.props.content
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get attachments() {
    return this.props.attachments
  }

  get slug() {
    return this.props.slug
  }

  get title() {
    return this.props.title
  }

  get authorId() {
    return this.props.authorId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updateAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    if (bestAnswerId === undefined) {
      return
    }

    if (
      this.props.bestAnswerId === undefined ||
      !this.props.bestAnswerId.equals(bestAnswerId)
    ) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }

    this.props.bestAnswerId = bestAnswerId

    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
      },
      id,
    )

    return question
  }
}
