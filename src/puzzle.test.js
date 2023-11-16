import { expect, test } from 'vitest'
import { getGuidelines } from './puzzle'

test('getGuidelines', () => {
  const origin = { x: 10, y: 100 }
  const cells = [
    { x: 15, y: 120 },
    { x: 16, y: 120 },
    { x: 15, y: 140 },
    { x: 16, y: 130 }
  ]
  const expectedGuidelines = {
    horizontalGuidelines: [20, 40, 30],
    verticalGuidelines: [5, 6]
  }
  expect(getGuidelines(origin, cells)).toStrictEqual(expectedGuidelines)
})
