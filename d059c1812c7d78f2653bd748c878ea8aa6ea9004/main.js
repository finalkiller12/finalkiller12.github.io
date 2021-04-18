
// change these numbers when you want to resize
// also remember to change .canvas-container's dimensions too
const canvas_size = [
    { width: 950, height: 300 },
    { width: 950, height: 300 }
];

const breakers = [
    { name: 'Bus-Coupler',      height: 1800, width: 80},
    { name: 'Incoming',         height: 1800, width: 80},
    { name: 'Relay',            height: 1800, width: 30},
    { name: 'MCCB-100',         height: 200, width: 60 },
    { name: 'MCCB-250',         height: 200, width: 60 },
    { name: 'MCCB-400',         height: 400, width: 60 },
    { name: 'MCCB-630',         height: 600, width: 60 },
    { name: 'MCCB-900',         height: 900, width: 60 },
    { name: 'ACB-1200',        height: 1800, width: 60 },
    { name: 'ACB-1600',        height: 1800, width: 60 },
    { name: 'ACB-3000',        height: 1800, width: 80 },
]

function initEstimations(){

    const boards = document.getElementsByClassName('boards');

    const canvas_objects = [{
        name: 'guthrie-1',
        ctx: boards[0].getContext("2d"),
        size: canvas_size[0],
        origin: { x: 10, y: 5 },
        column: { 
            limit: 1800,
            spacing: 0
        },
        max_columns: 12,
        measurementDisplay: measurements[0]
    }, {
        name: 'guthrie-2',
        ctx: boards[1].getContext("2d"),
        size: canvas_size[1],
        origin: { x: 10, y: 5 },
        column: { 
            limit: 1800,
            spacing: 10,
        },
        max_columns: 12,
        measurementDisplay: measurements[1]
    }]

    const canvases = document.getElementsByClassName('boards');
    const estimations = []
    for (let i = 0; i < canvas_objects.length; i++){
        estimations.push(new CanvasObject(canvas_objects[i]))
        estimations[i].setDomCanvasSize(canvases[i]);
    }

    return estimations;
}
class CanvasObject {
    constructor(obj) {
        this.name = obj.name;
        this.ctx = obj.ctx;
        this.size = obj.size;
        this.origin = obj.origin;
        this.column = obj.column;
        this.max_columns = obj.max_columns;
        this.measurementDisplay = obj.measurementDisplay;
    }

    setDomCanvasSize(domCanvas) {
        domCanvas.height = this.size.height;
        domCanvas.width = this.size.width;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.size.width, this.size.height);
    }

    groupUnits(units) {
        let groups = [...Array(this.max_columns)].map(e => Array());
    
        let { column } = this;
        // recursively find a placement for the breaker
        function findPlacement(unit, column_idx) {
            let heightSum = groups[column_idx].map(a => a.height);
            let potentialCombinedHeight = sum(heightSum.concat(unit.height))
            if (potentialCombinedHeight <= column.limit) {
                groups[column_idx].push(unit);
            } else { // no space
                if (column_idx == groups.length - 1) { // last group
                    return; // stop recursion
                }
    
                findPlacement(unit, column_idx + 1)
            }
        }
    
        // find placement starting with the biggest sizes
        for (let i = units.length - 1; i >= 0; i--) {
            findPlacement(units[i], 0);
        }
    
        // sort each column in desc order
        for (let i = 0; i < groups.length; i++) {
            groups[i] = groups[i].sort(function (a, b) { return b.height - a.height })
        }
    
        // sort all column in desc order by first unit size
        groups = groups.sort(function (a, b) {
            if (a.length != 0 && b.length != 0) // handle empty groups
                return b[0].height - a[0].height 
        });
    
        console.log(groups);
    
        return groups;
    }

    calcDrawingWidth(blocks) {
        let width = 0;
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].length > 0) { // column not empty
                width += blocks[i][0].width + this.column.spacing*2; // column's first unit's width + spacing
                // this will count extra spacing for last column
            }
        }
        
        return width*10;
    }

    displayMeasurements(blocks){
        const width = this.calcDrawingWidth(blocks);
        this.measurementDisplay.textContent = `Overall Dimension (Including Busbar Panel..etc): Length = 800 , Width = ${width} , Height = 2075`;
    }

    drawBreakers(blocks, blockText = 'name', thickness = 1) {
        const { ctx, column, origin } = this;
        const vertical_spacing = 1;
    
        // tested scaling factor: 8.9 for limit=1800, 13.4 for limit=2700, 17.8 for limit=3600
        // plug into desmos to find y=mx+c lol
        const m = 0.00494444
        const c = 1 / 60;
        const scaling_factor = m * column.limit + c;
    
        const currentPos = { x: origin.x, y: origin.y }; // copy by value, not reference
    
        for (let col = 0; col < blocks.length; col++) { // iterate each column
    
            if (blocks[col].length > 0){ // skip everything if column is empty
                if (col > 0){
                    currentPos.x += blocks[col-1][0].width + column.spacing;
                }
                currentPos.y = 0;
    
                for (let j = 0; j < blocks[col].length; j++) { // iterate each unit within the column

                    if (col < 11){
                    const block_height = blocks[col][j].height / scaling_factor - vertical_spacing;
    
                    // draw the unit  
                    ctx.fillStyle = "rgba(255,0,0,0.5)";
                    ctx.fillRect(currentPos.x - (thickness), currentPos.y - (thickness), blocks[col][j].width + (thickness*2), block_height + (thickness*2));
    
                    // write centered text
                    let textToUse = '';
                    if (blockText == 'breakerrating') {
                        textToUse = String(blocks[col][j].name);
                    } else if (blockText == 'width') {
                        textToUse = String(blocks[col][j].width)*10;
                       } else if (blockText == 'height') {
                          textToUse = String(blocks[col][j].height);
                    }
                    ctx.fillStyle = "black";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.font = "10px Arial";
                    ctx.fillText(textToUse, currentPos.x + (blocks[col][j].width / 2), currentPos.y + (block_height / 2));
                    
                    currentPos.y += block_height + vertical_spacing; // start the next drawing lower down
                    }
                    else{
                        alert("Excceed 11 Panels. Not all Breakers will be shown. Measurement will be incorrect. Please reduce the numbers of breaker")
                        break;
                    }
                
                }
            }
        }
    }
}

/// main program start
const estimate_btn = document.getElementById('estimate-btn');
const measurements = document.getElementsByClassName('measurements');

const estimations = initEstimations();
estimate_btn.addEventListener('click', function () {

    const quantities = gatherUnitSelections();
    const units = countUnits(quantities);

    const blockText = document.getElementById('block-text').value.toLowerCase();

    for (let i = 0; i < estimations.length; i++) {
        estimations[i].clearCanvas();
        const blocks = estimations[i].groupUnits(units);
        estimations[i].displayMeasurements(blocks);
        estimations[i].drawBreakers(blocks, blockText)
    }
})

document.getElementById('random-qty-btn').addEventListener('click', function () {
    const selects = document.getElementsByClassName('select-position');

    for (let i = 0; i < selects.length; i++) {
        let value = parseInt(Math.random()*6);
        if (breakers[i].height == 1800){
            value = 0; // dont set tallest units cus they dont help with testing
        }
        selects[i].value = value;
    }
})
/// main program end lol


function gatherUnitSelections(){
    const selects = document.getElementsByClassName('select-position');
    let values = [];
    for (let i = 0; i < selects.length; i++) {
        values.push(parseInt(selects[i].value));
    }
    return values;
}

function countUnits(quantities) {
    var units = []; // Size to be change according to breaker rating

    // count the number of each unit
    for (let i = 0; i < quantities.length; i++) {
        units.push(...Array(quantities[i]).fill(breakers[i]));
    }
    return units;
}

function sum(arr, stop=arr.length) {
    arr = arr.slice(0, stop)
    return arr.reduce((a, b) => a + b, 0);
}

//Music function to be exculded near the end
var audio = document.getElementById('audio');

function play() {
  audio.play();
}

function pause() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function stop() {
  audio.pause();
  audio.currentTime = 0;
}