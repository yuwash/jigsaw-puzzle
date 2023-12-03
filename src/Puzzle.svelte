<script>
  import { onMount } from 'svelte';
  import Moveable from 'svelte-moveable';

  export let puzzle;
  export let checkTiles;
  export let setImage;
  export let setImageByUrl;
  export let updateGuidelines;
  export let rescale;
  export let shuffle;
  export let solutionMoves;
  export let finished;

  let puzzleAreaMoveable;
  let puzzleAreaTarget;

  function onResizePuzzleArea() {
    // logic here
  }

  function updateMoveableGuidelines() {
    // logic here
  }

  function afterRescale() {
    // logic here
  }

  function onFileChange() {
    // logic here
  }

  function onSetExampleImage() {
    // logic here
  }

  function resetMoveables() {
    // logic here
  }

  onMount(() => {
    // logic here
  });
</script>

<div class="puzzle-area">
  <div class="puzzle-area-movable" bind:this={puzzleAreaTarget}>
    <!-- puzzle tiles here -->
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

<svelte:window
  on:load={updateMoveableGuidelines}
  on:resize={() => {rescale(puzzle); afterRescale();}}
/>

<style>
  .tile {display: inline-block; position: absolute; background-color: bisque; outline: 1px solid orange;}
  .finished .puzzle-label {color: green;}
</style>
