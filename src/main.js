import App from './App.svelte'
import { makePuzzle, checkTiles } from './puzzle'

const puzzle0 = makePuzzle('p0', 3, 2)

const app = new App({
  target: document.body,
  props: { puzzle: puzzle0, checkTiles }
})

export default app
