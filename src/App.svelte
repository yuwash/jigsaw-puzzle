<script>
import Moveable from "svelte-moveable";
import { writable } from 'svelte/store';
import { tick } from "svelte";
export let puzzle, checkTiles, setImage, setImageByUrl, updateGuidelines, rescale, shuffle, finished;
let moveablesByTile = {};

const tileBoxesFromPuzzle = puzzle => Object.fromEntries(puzzle.shelf.map(
	tile => [tile.name, {x: tile.x, y: tile.y, width: tile.shape.width, height: tile.shape.height}])
);
const tileBoxes = writable(tileBoxesFromPuzzle(puzzle));

// Foollowing variables are for reactiveness.
let height = puzzle.height;
let horizontalGuidelines = puzzle.horizontalGuidelines;
let verticalGuidelines = puzzle.verticalGuidelines;

const onDrag = ({ detail: e }) => {
	e.target.style.transform = e.transform;
	const finishedNow = checkTiles(puzzle);
	if(finished !== finishedNow){finished = finishedNow};
}
const onFileChange = event => {
	const file = event.target.files[0];
	if (!file) return;
	setImage(puzzle, event.target.files[0]).then(afterRescale);
}
const onSetExampleImage = () => {
	setImageByUrl(puzzle, puzzle.exampleImage.url).then(afterRescale);
}
const resetMoveables = () => {
	for (const moveable of Object.values(moveablesByTile)) {
		const manager = moveable.getManager();
		const [translateX, translateY] = manager.state.targetMatrix.slice(12, 14);
		moveable.request(
			"draggable", {deltaX: -translateX, deltaY: -translateY}, true
		);
	}
}
const shufflePuzzle = () => {
	shuffle(puzzle);
	tileBoxes.set(tileBoxesFromPuzzle(puzzle));
}
const updateMoveableGuidelines = () => {
	updateGuidelines(puzzle);
	horizontalGuidelines = puzzle.horizontalGuidelines;
	verticalGuidelines = puzzle.verticalGuidelines;
}
const afterRescale = () => {
	height = puzzle.height;
	tick().then(updateMoveableGuidelines);
}
window.addEventListener('load', updateMoveableGuidelines);
window.addEventListener('resize', () => {rescale(puzzle); afterRescale();});
</script>

<main class={'puzzle' + (finished ? ' finished' : '')}>
	<p class="puzzle-label"><strong>{puzzle.label}</strong></p>
	<p>
		<input type="file" id="file-input-{puzzle.name}" on:change={onFileChange}/>
		<button type="button" class="button" on:click={onSetExampleImage}>Use example image</button>
		<button type="button" class="button" on:click={resetMoveables}>Reset</button>
		<button type="button" class="button" on:click={shufflePuzzle}>Shuffle</button>
	</p>
	<div class="grid" id="grid-{puzzle.name}" style="height: {height}vw">
	{#each puzzle.grid as cell}
	<div class="grid-cell" id="grid-cell-{puzzle.name}-{cell.name}" style="left: {cell.x * 100}%; top: {cell.y * 100}%; width: {cell.shape.width * 100}%; height: {cell.shape.height * 100}%;"></div>
	{/each}
	</div>
	<div class="shelf" id="shelf-{puzzle.name}" style="height: {height}vw">
	{#each puzzle.shelf as tile}
	{@const tileBox = $tileBoxes[tile.name]}
	<div class="tile" id="tile-{puzzle.name}-{tile.name}" bind:this={puzzle.tileTargets[tile.name]} style="left: {tileBox.x * 100}%; top: {tileBox.y * 100}%; width: {tile.shape.width * 100}%; height: {tile.shape.height * 100}%">
		<svg style="width: 100%; height: 100%;">
			<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">{tile.label}</text>
		</svg>
	</div>
	<Moveable
		className="tile-movable"
		target={puzzle.tileTargets[tile.name]}
		draggable={true}
		snappable={true}
		horizontalGuidelines={horizontalGuidelines}
		verticalGuidelines={verticalGuidelines}
		snapThreshold={10}
		on:drag={onDrag}
		bind:this={moveablesByTile[tile.name]}
	/>
	{/each}
	</div>
</main>

<style>
	.tile {display: inline-block; position: absolute; background-color: bisque; outline: 1px solid orange;}
	.finished .puzzle-label {color: green;}
	.finished .puzzle-label:after {content: ' 🎉';}
	.grid {position: relative; width: 100%; background-color:lavenderblush;}
	.grid-cell {display: inline-block; position: absolute}
	.grid-cell:hover, .grid-cell:active {background-color:mintcream;}
	.shelf {position: relative; width: 100%; background-color: aliceblue;}
	:global(.tile-movable .moveable-origin, .tile-movable .moveable-line) {opacity: 0;}
</style>