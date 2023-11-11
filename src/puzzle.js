import _ from 'lodash'

import { SVG } from '@svgdotjs/svg.js'

export const makePuzzle = (name, cols, rows, label, initHeight = 50) => {
  const shape = { width: 1 / cols, height: 1 / rows }
  const indices = [cols, rows].reduce(
    // Cartesian product of ranges.
    (result, n) => result.flatMap(partial => _.range(n).map(i => [...partial, i])),
    [[]]
  )
  const tiles = indices.map(
    (xyIndex, i) => ({ label: `${i}`, shape, name: `T${i}`, x: 0, y: 0 })
  )
  const tileByName = Object.fromEntries(tiles.map(t => [t.name, t]))
  const initialOrder = _.shuffle(indices)
  tiles.forEach((tile, i) => {
    tile.x = shape.width * initialOrder[i][0]
    tile.y = shape.height * initialOrder[i][1]
  })
  const tileTargets = Object.fromEntries(tiles.map(c => [c.name, null]))
  const grid = indices.map(
    ([ix, iy]) => (
      { x: ix * shape.width, y: iy * shape.height, shape, name: `${ix}-${iy}` }
    )
  )
  const cellByName = Object.fromEntries(grid.map(cell => [cell.name, cell]))
  const shelf = Array.from(tiles)
  const correctAllocation = Object.fromEntries(
    _.zip(shelf.map(tile => tile.name), grid.map(cell => cell.name))
  )
  return {
    name, label, tiles, tileByName, tileTargets, grid, cellByName, shelf, correctAllocation, height: initHeight
  }
}

const getGridCellBoundingClientRects = puzzle => (
  Object.fromEntries(puzzle.grid.map(cell => [
    cell.name, getElementForGridCell(puzzle, cell).getBoundingClientRect()
  ]))
)
const gridCellOfTile = (puzzle, tileName, gridCellBoundingClientRects) => {
  const tileElement = getElementForTile(puzzle, tileName)
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
const getElementForTile = (puzzle, tileName) => (
  document.querySelector(`#tile-${puzzle.name}-${tileName}`)
)
const getElementForGridCell = (puzzle, gridCell) => (
  document.querySelector(`#grid-cell-${puzzle.name}-${gridCell.name}`)
)
const getCurrentAllocation = puzzle => {
  const gridCellBoundingClientRects = getGridCellBoundingClientRects(puzzle)
  return Object.fromEntries(
    puzzle.tiles.map(tile => [
      tile.name, gridCellOfTile(puzzle, tile.name, gridCellBoundingClientRects)
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
export const setImage = (puzzle, file) => (
  file.text().then(fileContent => {
    const originalViewBox = SVG().svg(fileContent).node.querySelector('svg').viewBox.baseVal
    const ratio = originalViewBox.width / originalViewBox.height
    const gridBBox = document.querySelector(`#grid-${puzzle.name}`).getBoundingClientRect()
    const scale = gridBBox.width / originalViewBox.width
    const newGridHeight = ratio ? gridBBox.width / ratio : gridBBox.height
    Object.entries(puzzle.correctAllocation).forEach(([tileName, cellName]) => {
      const tileElement = getElementForTile(puzzle, tileName)
      const svgElement = tileElement.querySelector('svg')
      const cell = puzzle.cellByName[cellName]
      const tileWidth = gridBBox.width * cell.shape.width
      const tileHeight = newGridHeight * cell.shape.height
      const draw = SVG(svgElement)
      const fileSvg = SVG().svg(fileContent).first()
      // svg(.., true) makes the following group.add fail.
      // Withoug svg.first, it would create another layer of svg.
      const drawGroup = draw.group().add(fileSvg)
      drawGroup.move(-originalViewBox.width * cell.x, -originalViewBox.height * cell.y)
      drawGroup.scale(scale, 0, 0)
    })
    if (ratio) {
      puzzle.height = 100 * newGridHeight / window.innerWidth // Css vw unit.
    }
  })
)
