<script>
import Moveable from "svelte-moveable";
import { writable } from "svelte/store";
export let puzzle, checkTiles, setImage, setImageByUrl, finished;
let height = puzzle.height;  // For reactiveness.
const onDrag = ({ detail: e }) => {
	e.target.style.transform = e.transform;
	const finishedNow = checkTiles(puzzle);
	if(finished !== finishedNow){finished = finishedNow};
}
const onFileChange = event => {
	const file = event.target.files[0];
	if (!file) return;
	setImage(puzzle, event.target.files[0]).then(() => {
		height = puzzle.height;
	});
}
const onSetExampleImage = () => {
	setImageByUrl(puzzle, puzzle.exampleImage.url).then(() => {
		height = puzzle.height;
	})
}
</script>

<main class={'puzzle' + (finished ? ' finished' : '')}>
	<p class="puzzle-label"><strong>{puzzle.label}</strong></p>
	<p>
		<input type="file" id="file-input-{puzzle.name}" on:change={onFileChange}/>
		<button type="button" class="button" on:click={onSetExampleImage}>Use example image</button>
	</p>
	<div class="grid" id="grid-{puzzle.name}" style="height: {height}vw">
	{#each puzzle.grid as cell}
	<div class="grid-cell" id="grid-cell-{puzzle.name}-{cell.name}" style="left: {cell.x * 100}%; top: {cell.y * 100}%; width: {cell.shape.width * 100}%; height: {cell.shape.height * 100}%;"></div>
	{/each}
	</div>
	<div class="shelf" id="shelf-{puzzle.name}" style="height: {height}vw">
	{#each puzzle.shelf as tile}
	<div class="tile" id="tile-{puzzle.name}-{tile.name}" bind:this={puzzle.tileTargets[tile.name]} style="left: {tile.x * 100}%; top: {tile.y * 100}%; width: {tile.shape.width * 100}%; height: {tile.shape.height * 100}%">
		<svg style="width: 100%; height: 100%;">
			<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">{tile.label}</text>
		</svg>
	</div>
	<Moveable className="tile-movable" target={puzzle.tileTargets[tile.name]} draggable={true}
	on:drag={onDrag}
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