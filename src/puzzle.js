import _ from 'lodash'

export const makePuzzle = (name, cols, rows, label) => {
  const shape = { width: 1 / cols, height: 1 / rows }
  const indices = [cols, rows].reduce(
    // Cartesian product of ranges.
    (result, n) => result.flatMap(partial => _.range(n).map(i => [...partial, i])),
    [[]]
  )
  const tiles = indices.map(
    (xyIndex, i) => ({ label: `${i}`, shape, name: `T${i}`, x: 0, y: 0 })
  )
  const initialOrder = _.shuffle(indices)
  tiles.forEach((tile, i) => {
    tile.x = shape.width * initialOrder[i][0]
    tile.y = shape.height * initialOrder[i][1]
  })
  const tileTargets = Object.fromEntries(tiles.map(c => [c.name, null]))
  const grid = indices.map(
    ([ix, iy]) => ({ x: ix * shape.width, y: iy * shape.height, shape, name: `${ix}-${iy}` })
  )
  const shelf = Array.from(tiles)
  const correctAllocation = Object.fromEntries(
    _.zip(shelf.map(tile => tile.name), grid.map(cell => cell.name))
  )
  return {
    name, label, tiles, tileTargets, grid, shelf, correctAllocation
  }
}

const getGridCellBoundingClientRects = puzzle => (
  Object.fromEntries(puzzle.grid.map(cell => [
    cell.name, getElementForGridCell(puzzle, cell).getBoundingClientRect()
  ]))
)
const gridCellOfTile = (puzzle, tile, gridCellBoundingClientRects) => {
  const tileElement = getElementForTile(puzzle, tile)
  const { top, left, width, height } = tileElement.getBoundingClientRect()
  const tileCenterX = left + width / 2
  const tileCenterY = top + height / 2
  let deltaX, deltaY
  const result = Object.entries(gridCellBoundingClientRects).find(([cellName, boundingClientRect]) => (
    (deltaX = tileCenterX - boundingClientRect.left) >= 0 && deltaX < boundingClientRect.width &&
    (deltaY = tileCenterY - boundingClientRect.top) >= 0 && deltaY < boundingClientRect.height
  ))
  if (result === undefined) {
    return result
  }
  const [cellName, boundingClientRect] = result
  return cellName
}
const getElementForTile = (puzzle, tile) => (
  document.querySelector(`#tile-${puzzle.name}-${tile.name}`)
)
const getElementForGridCell = (puzzle, gridCell) => (
  document.querySelector(`#grid-cell-${puzzle.name}-${gridCell.name}`)
)
const getCurrentAllocation = puzzle => {
  const gridCellBoundingClientRects = getGridCellBoundingClientRects(puzzle)
  return Object.fromEntries(
    puzzle.tiles.map(tile => [
      tile.name, gridCellOfTile(puzzle, tile, gridCellBoundingClientRects)
    ])
  )
}
export const checkTiles = puzzle => {
  const currentAllocation = getCurrentAllocation(puzzle)
  const resultOfEachTile = Object.fromEntries(Object.entries(currentAllocation).map(
    ([tileName, gridCellName]) => [
      tileName, puzzle.correctAllocation[tileName] === gridCellName
    ]))
  return _.every(resultOfEachTile)
}
