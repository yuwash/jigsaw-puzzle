<script>
import Puzzle from "./Puzzle.svelte";
export let puzzle, checkTiles, setImage, setImageByUrl, updateGuidelines, rescale, shuffle, solutionMoves, finished;

let puzzleComponent;

const onFileChange = event => {
	const file = event.target.files[0];
	if (!file) return;
	setImage(puzzle, event.target.files[0]).then(puzzleComponent.afterRescale);
}

const onSetExampleImage = () => {
	setImageByUrl(puzzle, puzzle.exampleImage.url).then(puzzleComponent.afterRescale);
}
</script>

<main class={'puzzle' + (finished ? ' finished' : '')}>
	<p class="puzzle-label"><strong>{puzzle.label}</strong></p>
	<p>
		<input type="file" id="file-input-{puzzle.name}" on:change={onFileChange}/>
		<button type="button" class="button" on:click={onSetExampleImage}>Use example image</button>
		<button type="button" class="button" on:click={puzzleComponent.resetMoveables}>Reset</button>
		<button type="button" class="button" on:click={puzzleComponent.shufflePuzzle}>Shuffle</button>
		<button type="button" class="button" on:click={puzzleComponent.solvePuzzle}>Solve</button>
	</p>
	<Puzzle
		bind:this={puzzleComponent}
		{puzzle}
		{checkTiles}
		{updateGuidelines}
		{rescale}
		{shuffle}
		{solutionMoves}
		bind:finished
	/>
</main>

<style>
	.finished .puzzle-label {color: green;}
	.finished .puzzle-label:after {content: ' 🎉';}
</style>