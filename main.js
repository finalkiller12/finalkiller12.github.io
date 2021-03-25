// change these numbers when you want to resize
// also remember to change .canvas-container's dimensions too
const canvas_size = [
    { width: 800, height: 300 },
    { width: 800, height: 300 }
];

const sizes = [1800, 0, 0, 200, 200, 400, 630, 900, 1800, 1800];

const boards = document.getElementsByClassName('boards');

const canvas_objects = [{
    name: 'guthrie-1',
    ctx: boards[0].getContext("2d"),
    size: canvas_size[0],
    origin: { x: 10, y: 5 },
    column: { 
        widths: [40, 40, 60, 60, 60, 60, 60], 
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
        widths: [60, 60, 60, 60, 60, 60, 60], 
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
    
    // clear canvas
    for (let i = 0; i < canvas_objects.length; i++) {
        const { ctx, size: board } = canvas_objects[i];
        // const board = c.size;
        ctx.clearRect(0, 0, board.width, board.height);
    }

    // gather select input values
    const selects = document.getElementsByClassName('select-position');
    let values = [];
    for (let i = 0; i < selects.length; i++) {
        values.push(parseInt(selects[i].value));
    }

    const block_text = document.getElementById('block-text').value.toLowerCase();
    const units = countUnits(values);


    for (let i = 0; i < canvas_objects.length; i++) {
        const c = canvas_objects[i]; // for easier reference

        // do calculation
        const blocks = groupUnits(units, c.column.limit, c.max_columns);

        // draw
        console.log('drawing on: ' + c.name);
        drawBreakers(c, blocks, block_text);
    }
})

function countUnits(quantities) {

    // Size to be change according to breaker rating
    var units = [];

    // count the number of each unit
    for (let i = 0; i < quantities.length; i++) {
        units.push(...Array(quantities[i]).fill(sizes[i]));
    }
    return units;
}

// calculate the grouping for each column using algo or whatever
function groupUnits(units, column_limit, max_columns) {
    let groups = [...Array(max_columns)].map(e => Array());

    // recursively find a placement for the breaker
    function findPlacement(unit, column_idx) {
        
        if (sum(groups[column_idx].concat(unit)) <= column_limit) {
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

    for (let col = 0; col < blocks.length; col++) { // iterate each column
        
        const start_pos = { x: origin.x + sum(column.widths, col) + col * column.spacing, y: origin.y };
        let total_height = 0;

        for (let j = 0; j < blocks[col].length; j++) { // iterate each unit within the column
            
            const block_height = blocks[col][j] / scaling_factor - vertical_spacing;
            const current_y = start_pos.y + total_height;

            // draw the unit
            ctx.fillStyle = "rgba(255,0,0,0.5)";
            ctx.fillRect(start_pos.x, current_y, column.widths[col], block_height);

            // write centered text
            let textToUse = '';
            if (block_text == 'height') {
                textToUse = String(blocks[col][j]);
            } else if (block_text == 'width') {
                textToUse = String(column.widths[col])*10;
            }
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "16px Arial";
            ctx.fillText(textToUse, start_pos.x + (column.widths[col] / 2), current_y + (block_height / 2));
            total_height += block_height + vertical_spacing; // start the next drawing lower down
        }
    }
}
