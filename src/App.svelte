<Puzzle
    {puzzle=puzzle}
    {checkTiles=checkTiles}
    {setImage=setImage}
    {setImageByUrl=setImageByUrl}
    {updateGuidelines=updateGuidelines}
    {rescale=rescale}
    {shuffle=shuffle}
    {solutionMoves=solutionMoves}
    {finished=finished}
    {onFileChange=onFileChange}
    {onSetExampleImage=onSetExampleImage}
    {resetMoveables=resetMoveables}
    {shufflePuzzle=shufflePuzzle}
    {solvePuzzle=solvePuzzle}
/>


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