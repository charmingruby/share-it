import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  }

  return left('error')
}

test('sucess result', () => {
  const sucessResult = doSomething(true)

  expect(sucessResult.isRight()).toBe(true)
  expect(sucessResult.isLeft()).toEqual(false)
})

test('sucess result', () => {
  const errorResult = doSomething(false)

  expect(errorResult.isLeft()).toEqual(true)
  expect(errorResult.isRight()).toEqual(false)
})
