// change these numbers when you want to resize
// also remember to change canvas-container's dimensions too
const canvas_size = {height: 330, width: 480};

const column_limit = 2000;

// canvas stuff
const canvases = document.getElementsByTagName('canvas');
for (let i = 0; i < canvases.length; i++){
	canvases[i].height = canvas_size.height;
  canvases[i].width = canvas_size.width;
}

const board = document.getElementById('board');
const ctx = board.getContext("2d");
const origin = {x: 38, y: 70};
const column = {width: 66, height: 200};

// calculation stuff
const estimate_btn = document.getElementById('estimate-btn');

estimate_btn.addEventListener('click', function(){
	// clear canvas
  ctx.clearRect(0, 0, board.width, board.height);
  
  // gather select input values
  const selects = document.getElementsByClassName('select-position');
  let values = [];
  for (let i = 0; i < selects.length; i++) {
  	values.push(parseInt(selects[i].value));
  }
  // do calculation
  const units = countUnits(values);
  const blocks = groupUnits(units);
  // draw
  drawBreakers(blocks);
})

function countUnits(quantities){
	// Size to be change according to breaker rating
	sizes = [0, 0, 200, 200, 400, 630, 900, 1200, 1600]; 
  var units = [];
  // https://stackoverflow.com/questions/45770423/javascript-push-shift-same-element-multiple-times
  for (let i = 0; i < quantities.length; i++) {
    units.push( ...Array(quantities[i]).fill(sizes[i]) );
  }
  return units;
}

// calculate the grouping for each column using algo or whatever
function groupUnits(units){
  let groups = [[],[],[],[],[],[]]; // should find this dynamically instead
  
  // recursively find a placement for the breaker
  function findPlacement(unit, column_idx){
  	console.log(groups[column_idx]);
  	if (sum(groups[column_idx].concat(unit)) <= column_limit) {
    	groups[column_idx].push(unit);
    } else {
    	if (column_idx == groups.length-1){ // last group
      	console.log('could not find any space')
      	return;
      }
    	findPlacement(unit, column_idx+1)
    }
  }
  
  // find placement starting with the biggest sizes
  for (let i = units.length-1; i >= 0 ; i--){
  	/* console.log('finding place for: '+String(units[i])); */
		findPlacement(units[i], 0);
  }
  // sort each column in desc order
  for (let i = 0; i < groups.length; i++){
  	groups[i] = groups[i].sort(function(a, b){return b-a})
  }
  // sort all column in desc order by first unit size
  groups = groups.sort(function(a, b){return b[0] - a[0]});
  
  // debugging the group sizes
  for (let i = 0; i < groups.length; i++){
  	console.log(`group ${i}: ${sum(groups[i])}`);
  }
  console.log(groups);
  
  return groups;
}

function sum(arr){
	return arr.reduce((a, b) => a + b, 0);
}

function drawBreakers(blocks){
  const column_spacing = 3;
  const vertical_spacing = 2;
  // tested scaling factor: 8.9 for limit=1800, 13.4 for limit=2700, 17.8 for limit=3600
  // plug into desmos to find y=mx+c lol
  const m = 0.00494444
  const c = 1/60;
  const scaling_factor = m*column_limit+c;
  for (let col = 0; col < blocks.length; col++){
		// draw each column
		const start_pos = {x: origin.x + col*(column.width+column_spacing), y: origin.y};
    let total_height = 0;
    for (let j = 0; j < blocks[col].length; j++){
  		// draw each unit within the column
      const block_height = blocks[col][j]/scaling_factor - vertical_spacing;
      const current_y = start_pos.y + total_height;
      /* console.log(`drawing at y=${start_pos.y+total_height}, height=${block_height}`); */
  		ctx.fillStyle = "rgba(255,0,0,0.5)";
  		ctx.fillRect(start_pos.x, current_y, column.width, block_height);
  		ctx.fillStyle = "black";
      ctx.textAlign="center"; 
      ctx.textBaseline = "middle";
      ctx.fillText(String(blocks[col][j]),start_pos.x+(column.width/2), current_y+(block_height/2));
      total_height += block_height + vertical_spacing;
    }
  }
}

function testAlignment(){
  // draw all columns to test alignment
  for (var i = 0; i < 6; i++){
    var start_pos = {x: origin.x + i*(column.width+3), y: origin.y};
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(start_pos.x, start_pos.y, column.width, column.height);
  }
}
/* testAlignment(); */