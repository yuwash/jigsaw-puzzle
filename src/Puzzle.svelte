<script>
import Moveable from "svelte-moveable";
import { writable } from 'svelte/store';
import { tick } from "svelte";

export let puzzle, checkTiles, updateGuidelines, rescale, shuffle, solutionMoves, finished;
let gridTarget, puzzleAreaTarget, puzzleAreaMoveable;
let moveablesByTile = {};

const tileBoxesFromPuzzle = puzzle => Object.fromEntries(puzzle.shelf.map(
	tile => [tile.name, {x: tile.x, y: tile.y, width: tile.shape.width, height: tile.shape.height}])
);
const tileBoxes = writable(tileBoxesFromPuzzle(puzzle));

// Following variables are for reactiveness.
let height = puzzle.height;
let horizontalGuidelines = puzzle.horizontalGuidelines;
let verticalGuidelines = puzzle.verticalGuidelines;

const onDrag = ({ detail: e }) => {
	e.target.style.transform = e.transform;
	const finishedNow = checkTiles(puzzle);
	if(finished !== finishedNow){finished = finishedNow};
}

const onResizePuzzleArea = ({ detail: e }) => {
	puzzleAreaTarget.style.width = `${e.width}px`;
	const gridHeightFactor = (
		gridTarget.getClientRects()[0].height / puzzleAreaTarget.getClientRects()[0].height
	);
	puzzle.height = 100 * gridHeightFactor * e.height / window.innerWidth;
	rescale(puzzle);
	afterRescaleNoUpdateRect();
}

export const resetMoveables = () => {
	for (const moveable of Object.values(moveablesByTile)) {
		const manager = moveable.getManager();
		const [translateX, translateY] = manager.state.targetMatrix.slice(12, 14);
		moveable.request(
			"draggable", {deltaX: -translateX, deltaY: -translateY}, true
		);
	}
}

export const shufflePuzzle = () => {
	resetMoveables();
	shuffle(puzzle);
	tileBoxes.set(tileBoxesFromPuzzle(puzzle));
}

const updateMoveableGuidelines = () => {
	updateGuidelines(puzzle);
	horizontalGuidelines = puzzle.horizontalGuidelines;
	verticalGuidelines = puzzle.verticalGuidelines;
}

export const afterRescale = () => {
	height = puzzle.height;
	tick().then(() => {
		updateMoveableGuidelines();
		puzzleAreaMoveable.updateRect();
	});
}

const afterRescaleNoUpdateRect = () => {
	height = puzzle.height;
	tick().then(updateMoveableGuidelines);
}

export const solvePuzzle = () => {
	const moves = solutionMoves(puzzle);	
	for (const [tileName, move] of Object.entries(moves)) {
		const moveable = moveablesByTile[tileName];
		moveable.request("draggable", move, true);
	}
}
</script>

<svelte:window
	on:load={updateMoveableGuidelines}
	on:resize={() => {rescale(puzzle); afterRescale();}}
/>

<div class="puzzle-area" bind:this={puzzleAreaTarget}>
	<div class="grid" id="grid-{puzzle.name}" style="height: {height}vw" bind:this={gridTarget}>
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
	<Moveable
		className="puzzle-area-movable"
		target={puzzleAreaTarget}
		resizable={true}
		keepRatio={true}
		renderDirections={["e","s","se"]}
		on:resize={onResizePuzzleArea}
		bind:this={puzzleAreaMoveable}
	/>
</div>

<style>
	.tile {display: inline-block; position: absolute; background-color: bisque; outline: 1px solid orange;}
	.grid {position: relative; width: 100%; background-color:lavenderblush;}
	.grid-cell {display: inline-block; position: absolute}
	.grid-cell:hover, .grid-cell:active {background-color:mintcream;}
	.shelf {position: relative; width: 100%; background-color: aliceblue;}
	.puzzle-area {position: relative;}
	:global(.tile-movable .moveable-origin, .tile-movable .moveable-line) {opacity: 0;}
	:global(.puzzle-area-movable .moveable-origin, .puzzle-area-movable .moveable-line, .puzzle-area-movable .moveable-resizable) {opacity: 0;}
	:global(.puzzle-area-movable .moveable-resizable:hover, .puzzle-area-movable .moveable-resizable:active) {opacity: 1;}
</style>
