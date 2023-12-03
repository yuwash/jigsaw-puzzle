<script>
import { writable } from 'svelte/store';
import { tick } from "svelte";
export let puzzle;
let gridTarget;
let moveablesByTile = {};

const tileBoxesFromPuzzle = puzzle => Object.fromEntries(puzzle.shelf.map(
	tile => [tile.name, {x: tile.x, y: tile.y, width: tile.shape.width, height: tile.shape.height}])
);
const tileBoxes = writable(tileBoxesFromPuzzle(puzzle));

// Foollowing variables are for reactiveness.
let height = puzzle.height;

<main class={'puzzle' + (finished ? ' finished' : '')}>
	<p class="puzzle-label"><strong>{puzzle.label}</strong></p>
	<p>
		<input type="file" id="file-input-{puzzle.name}" on:change={onFileChange}/>
		<button type="button" class="button" on:click={onSetExampleImage}>Use example image</button>
		<button type="button" class="button" on:click={resetMoveables}>Reset</button>
		<button type="button" class="button" on:click={shufflePuzzle}>Shuffle</button>
		<button type="button" class="button" on:click={solvePuzzle}>Solve</button>
	</p>
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
</main>

<style>
	.tile {display: inline-block; position: absolute; background-color: bisque; outline: 1px solid orange;}
	.finished .puzzle-label {color: green;}
	.finished .puzzle-label:after {content: ' 🎉';}
	.grid {position: relative; width: 100%; background-color:lavenderblush;}
	.grid-cell {display: inline-block; position: absolute}
	.grid-cell:hover, .grid-cell:active {background-color:mintcream;}
	.shelf {position: relative; width: 100%; background-color: aliceblue;}
	.puzzle-area {position: relative;}
	:global(.tile-movable .moveable-origin, .tile-movable .moveable-line) {opacity: 0;}
	:global(.puzzle-area-movable .moveable-origin, .puzzle-area-movable .moveable-line, .puzzle-area-movable .moveable-resizable) {opacity: 0;}
	:global(.puzzle-area-movable .moveable-resizable:hover, .puzzle-area-movable .moveable-resizable:active) {opacity: 1;}
</style>