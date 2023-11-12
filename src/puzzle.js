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
const setSvgImage = (puzzle, getImageSvg) => {
  const imageSvg = getImageSvg()
  // Viewbox is the page, bbox contains potential overflows.
  // Some svg files don’t have a viewbox, so falling back to bbox then.
  const originalViewBox = imageSvg.first().viewbox()
  const originalBBox = imageSvg.first().bbox()
  const useBBox = !(originalViewBox.height && originalViewBox.width)
  const originalBox = useBBox ? originalBBox : originalViewBox
  const ratio = originalBox.width / originalBox.height
  const gridBBox = document.querySelector(`#grid-${puzzle.name}`).getBoundingClientRect()
  const scale = gridBBox.width / originalBox.width
  const newGridHeight = ratio ? gridBBox.width / ratio : gridBBox.height
  Object.entries(puzzle.correctAllocation).forEach(([tileName, cellName]) => {
    const cell = puzzle.cellByName[cellName]
    const tileElement = getElementForTile(puzzle, tileName)
    const svgElement = tileElement.querySelector('svg')
    const draw = SVG(svgElement)
    draw.clear()
    const imageSvg = getImageSvg().first()
    // svg(.., true) makes the following group.add fail.
    // Withoug svg.first, it would create another layer of svg.
    const drawGroup = draw.group().add(imageSvg)
    drawGroup.move(-originalBox.width * cell.x, -originalBox.height * cell.y)
    drawGroup.scale(scale, 0, 0)
  })
  if (ratio) {
    puzzle.height = 100 * newGridHeight / window.innerWidth // Css vw unit.
  }
}
export const setImage = (puzzle, file) => {
  if (file.type === 'image/svg+xml') {
    return file.text().then(fileContent => setSvgImage(
      puzzle, () => SVG().svg(fileContent) // Need to create a new svg as cloning seems to be buggy.
    ))
  }
  const imageSvg = SVG()
  return new Promise(resolve => imageSvg.image(URL.createObjectURL(file),
    event => {
      imageSvg.size(event.target.naturalWidth, event.target.naturalHeight)
      setSvgImage(puzzle, () => imageSvg.clone())
      resolve()
    }
  ))
}
