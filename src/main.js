import App from './App.svelte'
import blurUrl from './blur.jpg'
import { makePuzzle, checkTiles, setImage, setImageByUrl } from './puzzle'

const config = window.puzzleConfig
const defaultParams = {
  cols: 3,
  rows: 2,
  initHeight: 50,
  exampleImage: { url: blurUrl },
  label: 'Untitled Puzzle'
}

const apps = document.querySelectorAll('.puzzle').forEach(target => {
  const params = { ...defaultParams, ...config.puzzles[target.id] }
  const puzzle = makePuzzle(target.id, params)
  return new App({
    target, props: { puzzle, checkTiles, setImage, setImageByUrl }
  })
})

export default apps
