<script>
  import { onMount, afterUpdate } from 'svelte';
  import { rescale, setImageByUrl, setImage, getGuidelines, updateGuidelines } from './puzzle.js';
  import Moveable from 'svelte-moveable';

  export let puzzle;
  export let finished;
  export let onFileChange;
  export let onSetExampleImage;
  export let resetMoveables;

  let puzzleAreaTarget;
  let puzzleAreaMoveable;

  function updateMoveableGuidelines() {
    updateGuidelines(puzzle);
  }

  function onResizePuzzleArea() {
    rescale(puzzle);
    afterUpdate(updateMoveableGuidelines);
  }

  onMount(updateMoveableGuidelines);
</script>

<main class={'puzzle' + (finished ? ' finished' : '')}>
  <div class="puzzle-area" bind:this={puzzleAreaTarget}>
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
</style>
