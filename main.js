// change these numbers when you want to resize
// also remember to change .canvas-container's dimensions too
const canvas_size = [
    { width: 800, height: 300 },
    { width: 800, height: 300 }
];

const breakers = [
    { name: 'bus-coupler',      height: 1800, width: 80 },
    { name: 'incoming-feeder',  height: 1800, width: 80 },
    { name: 'outgoing-feeder',  height: 1800, width: 80 },
    { name: 'mmcb-100',         height: 200, width: 60 },
    { name: 'mmcb-250',         height: 200, width: 60 },
    { name: 'mmcb-400',         height: 400, width: 60 },
    { name: 'mmcb-630',         height: 630, width: 60 },
    { name: 'mmcb-900',         height: 900, width: 60 },
    { name: 'mmcb-1200',        height: 1800, width: 80 },
    { name: 'mmcb-1600',        height: 1800, width: 80 },
]

const boards = document.getElementsByClassName('boards');

const canvas_objects = [{
    name: 'guthrie-1',
    ctx: boards[0].getContext("2d"),
    size: canvas_size[0],
    origin: { x: 10, y: 5 },
    column: { 
        widths: [], 
        height: 200,
        limit: 1800,
        spacing: 3
    },
    max_columns: 7
}, {
    name: 'guthrie-2',
    ctx: boards[1].getContext("2d"),
    size: canvas_size[1],
    origin: { x: 10, y: 5 },
    column: { 
        widths: [], 
        height: 100,
        limit: 1800,
        spacing: 31.5,
    },
    max_columns: 7
}]

// set canvas sizes
const canvases = document.getElementsByTagName('canvas');
for (let i = 0; i < canvases.length; i++) {
    canvases[i].height = canvas_size[i].height;
    canvases[i].width = canvas_size[i].width;
}

// calculation stuff
const estimate_btn = document.getElementById('estimate-btn');

estimate_btn.addEventListener('click', function () {
    
    clearCanvases();

    const quantities = gatherUnitSelections();
    const units = countUnits(quantities);

    const block_text = document.getElementById('block-text').value.toLowerCase();

    for (let i = 0; i < canvas_objects.length; i++) {
        const c = canvas_objects[i];

        const blocks = groupUnits(units, c.column.limit, c.max_columns); // calculate breaker arrangement

        console.log('drawing on: ' + c.name);
        drawBreakers(c, blocks, block_text);
    }
})

function clearCanvases(){
    for (let i = 0; i < canvas_objects.length; i++) {
        const { ctx, size: board } = canvas_objects[i];
        ctx.clearRect(0, 0, board.width, board.height);
    }
}

function gatherUnitSelections(){
    const selects = document.getElementsByClassName('select-position');
    let values = [];
    for (let i = 0; i < selects.length; i++) {
        values.push(parseInt(selects[i].value));
    }
    return values;
}

function countUnits(quantities) {

    // Size to be change according to breaker rating
    var units = [];

    // count the number of each unit
    for (let i = 0; i < quantities.length; i++) {
        units.push(...Array(quantities[i]).fill(breakers[i]));
    }
    return units;
}

// calculate the grouping for each column using algo or whatever
function groupUnits(units, column_limit, max_columns) {
    let groups = [...Array(max_columns)].map(e => Array());

    // recursively find a placement for the breaker
    function findPlacement(unit, column_idx) {
        
        let heightSum = groups[column_idx].map(a => a.height);
        let potentialCombinedHeight = sum(heightSum.concat(unit.height))
        if (potentialCombinedHeight <= column_limit) {
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
        groups[i] = groups[i].sort(function (a, b) { return b - a })
    }

    // sort all column in desc order by first unit size
    groups = groups.sort(function (a, b) { return b[0] - a[0] });

    console.log(groups);

    return groups;
}

function sum(arr, stop=arr.length) {
    arr = arr.slice(0, stop)
    return arr.reduce((a, b) => a + b, 0);
}

function drawBreakers(cv_obj, blocks, block_text = 'height') {
    const { ctx, column, origin } = cv_obj;
    const vertical_spacing = 2;

    // tested scaling factor: 8.9 for limit=1800, 13.4 for limit=2700, 17.8 for limit=3600
    // plug into desmos to find y=mx+c lol
    const m = 0.00494444
    const c = 1 / 60;
    const scaling_factor = m * column.limit + c;

    let offset = { x: 0, y: 0 };

    for (let col = 0; col < blocks.length; col++) { // iterate each column
        
        if (blocks[col].length > 0){ // skip everything if column is empty
            if (col > 0){
                offset.x += blocks[col-1][0].width + column.spacing;
            }
            offset.y = 0;
            const start_pos = { x: origin.x + offset.x, y: origin.y };

            for (let j = 0; j < blocks[col].length; j++) { // iterate each unit within the column
                
                const block_height = blocks[col][j].height / scaling_factor - vertical_spacing;
                const current_y = start_pos.y + offset.y;

                // draw the unit
                ctx.fillStyle = "rgba(255,0,0,0.5)";
                ctx.fillRect(start_pos.x, current_y, blocks[col][j].width, block_height);

                // write centered text
                let textToUse = '';
                if (block_text == 'height') {
                    textToUse = String(blocks[col][j].height);
                } else if (block_text == 'width') {
                    textToUse = String(blocks[col][j].width)*10;
                }
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = "16px Arial";
                ctx.fillText(textToUse, start_pos.x + (blocks[col][j].width / 2), current_y + (block_height / 2));
                
                offset.y += block_height + vertical_spacing; // start the next drawing lower down
            }
        }
    }
}
