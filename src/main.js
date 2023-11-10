import App from './App.svelte'
import { makePuzzle, checkTiles } from './puzzle'

const config = window.puzzleConfig
const defaultParams = {
  width: 3,
  height: 2,
  label: 'Untitled Puzzle'
}

const apps = document.querySelectorAll('.puzzle').forEach(target => {
  const params = config.puzzles[target.id] ?? defaultParams
  const puzzle = makePuzzle(target.id, params.width, params.height, params.label)
  return new App({
    target, props: { puzzle: puzzle, checkTiles }
  })
})

export default apps
