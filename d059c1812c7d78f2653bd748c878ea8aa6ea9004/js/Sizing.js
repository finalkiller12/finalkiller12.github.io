
// change these numbers when you want to resize
// also remember to change .canvas-container's dimensions too
const canvas_size = [
    { width: 1000, height: 300 },
    { width: 1000, height: 300 },
    { width: 1000, height: 300 },

];

const relays = [
    { name: 'Relay', height: 1800,  width: 30 },
    { name: 'Relay', height: 400,   width: 60 }
]

const breakers = {
    guthrie: [
        { name: 'MCCB-100',         height: 200, width: 60 },
        { name: 'MCCB-250',         height: 200, width: 60 },
        { name: 'MCCB-400',         height: 400, width: 60 },
        { name: 'MCCB-630',         height: 600, width: 60 },
        { name: 'MCCB-900',         height: 900, width: 60 },
        { name: 'ACB-1200',        height: 1800, width: 60 },
        { name: 'ACB-1600',        height: 1800, width: 60 },
        { name: 'ACB-3000',        height: 1800, width: 80 },
    ],
    xyz: [
        { name: 'MCCB-100',         height: 300, width: 60 },
        { name: 'MCCB-250',         height: 200, width: 60 },
        { name: 'MCCB-400',         height: 400, width: 60 },
        { name: 'MCCB-630',         height: 600, width: 60 },
        { name: 'MCCB-900',         height: 900, width: 60 },
        { name: 'ACB-1200',        height:  900, width: 60 },
        { name: 'ACB-1600',        height: 1800, width: 60 },
        { name: 'ACB-3000',        height: 1800, width: 60 },
    ],
    xyza: [
        { name: 'MCCB-100',         height: 300, width: 60 },
        { name: 'MCCB-250',         height: 200, width: 60 },
        { name: 'MCCB-400',         height: 400, width: 60 },
        { name: 'MCCB-630',         height: 600, width: 60 },
        { name: 'MCCB-900',         height: 900, width: 60 },
        { name: 'ACB-1200',        height:  900, width: 60 },
        { name: 'ACB-1600',        height: 1800, width: 60 },
        { name: 'ACB-3000',        height: 1800, width: 60 },
    ]
}

function initEstimations(){

    const boards = document.getElementsByClassName('boards');

    const canvas_objects = [{
        name: 'guthrie',
        ctx: boards[0].getContext("2d"),
        size: canvas_size[0],
        origin: { x: 10, y: 5 },
        column: { 
            limit: 1800,
            spacing: 0
        },
        max_columns: 20,
        measurementDisplay: measurements[0]
    },{
        name: 'xyz',
        ctx: boards[1].getContext("2d"),
        size: canvas_size[1],
        origin: { x: 10, y: 5 },
        column: { 
            limit: 1800,
            spacing: 0,
        },
        max_columns: 20,
        measurementDisplay: measurements[1]

    },{   
        name: 'xyza',
        ctx: boards[2].getContext("2d"),
        size: canvas_size[2],
        origin: { x: 10, y: 5 },
        column: { 
            limit: 1800,
            spacing: 0,
        },
        max_columns: 20,
        measurementDisplay: measurements[2]
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

    insertRelays(groups){
        let newGroups = groups;
        let completeCols = [];
        let incompleteCols = [];

        for (let i = 0; i < newGroups.length; i++){
            let heightSum = newGroups[i].map(a => a.height);
            let potentialCombinedHeight = sum(heightSum.concat(relays[1].height)) // add small relay
            // check for complete column = columns with no space for small relay
            // these columns need the big relay adjacent to them
            if (potentialCombinedHeight > this.column.limit) { // small relay does not fit
                completeCols.push(i);
            }
            // check for incomplete column = columns with enough space to add small relay
            // add the small relay to the group and move it to 2nd position from the top
            else if (potentialCombinedHeight != relays[1].height){ // non empty column
                incompleteCols.push(i);
            }
        }

        // :;
        // append to all incompleteCols
        for (let i = 0; i < incompleteCols.length; i++){
            let index = incompleteCols[i];

            // if columnOnLeft will have a big relay appear to its right,
            //      do not insert

            if (index % 2 == 0){
                newGroups[index].splice(1, 0, relays[1]) // insert in position 2 from the top
            }
        }

        // [] | []
        // insert to the right of the first completeCol
        for (let i = completeCols.length-1; i >= 0; i--){
            // find odd numbered (even indexes) completeCols
            if (i % 2 == 0){
                // do not insert if both neighbours for the relay would be single-cell blocks
                if (i + 1 < newGroups.length){ // ensure i + 1 is reachable
                    if (newGroups[i].length == 1 && newGroups[i+1].length == 1){
                        continue;
                    }
                }
                const newColumn = [ relays[0] ];
                newGroups.splice(completeCols[i] + 1, 0, newColumn) // insert big relay to the right
            }
        }

        // loop 

        return newGroups;
    }

    emptySpace(blocks){
        for (let i=0; i < blocks.length; i++){
            if (blocks[i].length > 0){
                // map returns a list
                // reduce sums up the list
                let colSum = blocks[i].map(a => a.height).reduce((a, b) => a + b, 0)

                if(colSum < this.column.limit){
                    const avaiableSpace = this.column.limit - colSum;

                    const customBlock = {
                        name: 'Empty',
                        width: blocks[i][0].width,
                        height: avaiableSpace
                    };

                    blocks[i].push(customBlock);
                }
            }
        }

        return blocks;
    }
    calcDrawingWidth(blocks) {
        let width = 0;
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].length > 0) { // column not empty
                width += blocks[i][0].width + this.column.spacing*2; // column's first unit's width + spacing
                // this will count extra spacing for last column
            }
        }
        
        return (width*10)
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

                    if (this.calcDrawingWidth(blocks) < 9700){
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
                        alert("Excceed 10000mm wdith. Not all Breakers will be shown. Measurement will be incorrect. Please reduce the Quantity of breakers");
                        return false;
                    }
                
                }
            }
        }
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

function countUnits(quantities, supplierName) {
    var units = []; // Size to be change according to breaker rating

    // count the number of each unit
    for (let i = 0; i < quantities.length; i++) {
        units.push(...Array(quantities[i]).fill( breakers[supplierName][i] ));
    }
    return units;
}

function sum(arr, stop=arr.length) {
    arr = arr.slice(0, stop)
    return arr.reduce((a, b) => a + b, 0);
}

/// main program start
const estimate_btn = document.getElementById('estimate-btn');
const measurements = document.getElementsByClassName('measurements');

const estimations = initEstimations();
estimate_btn.addEventListener('click', function () {

    const quantities = gatherUnitSelections();
 
    const blockText = document.getElementById('block-text').value.toLowerCase();

    for (let i = 0; i < estimations.length; i++) {
        estimations[i].clearCanvas();
        const units = countUnits(quantities, estimations[i].name);
        const blocks = estimations[i].groupUnits(units);
        const blocksWithRelays = estimations[i].insertRelays(blocks);
        const paddedBlocks = estimations[i].emptySpace(blocksWithRelays);
        estimations[i].displayMeasurements(paddedBlocks);
        estimations[i].drawBreakers(blocksWithRelays, blockText)
    }
})
/// main program end lol

// button events

document.getElementById('random-qty-btn').addEventListener('click', function () {
    const selects = document.getElementsByClassName('select-position');

    for (let i = 0; i < selects.length; i++) {
        let value = parseInt(Math.random()*6);
        if (breakers['guthrie'][i].height == 1800){
            value = 0; // dont set tallest units cus they dont help with testing
        }
        selects[i].value = value;
    }
})

document.getElementById('reset-btn').addEventListener('click', function() {

    const listBox = document.getElementsByClassName('select-position');
    for (let i = 0; i < listBox.length; i++) {  
        listBox[i].selectedIndex = 0;
    }
    estimate_btn.click();
})

document.getElementById('Intro-btn').addEventListener('click', function() {
    startTour();
})

document.getElementById('Save-btn').addEventListener('click', function() {
    const preSetSaveToh = gatherUnitSelections();
    localStorage['quantities'] = JSON.stringify(preSetSaveToh);
})  

document.getElementById('Load-btn').addEventListener('click', function(){
    const preSetLoadToh = JSON.parse(localStorage['quantities']);
    const selects = document.getElementsByClassName('select-position');

    for (let i = 0; i < selects.length; i++) {
        selects[i].value = preSetLoadToh[i];
    }
    estimate_btn.click();
})  

// aesthetic stuff

function MusicSakura_start(){
    Sakura();
    play();
}

function MusicSakura_pause(){
    pause();
    $('body').sakura('stop')
}

function MusicSakura_stop(){
    stop();
    $('body').sakura('stop')
}

function startTour(){
    introJs().setOptions({
        showProgress: true,
        steps:[{
                title:'Welcome',
                intro:'Please follow the guide for 1st timer'
            },{
                element: document.querySelector('.sidebar-group'),
                intro: 'Select your breaker ratings',
                position: 'right' 
            },{
                element: document.querySelector('.Option-Drawing'),
                intro: 'Choose 1 options, Text will appear accordingly (Breaker Rating, Height, Widith)',
                position: 'right'
            },{
                element: document.querySelector('.Calculation'),
                intro: 'Click to display estimation',
                position: 'right'
            },{
                element: document.querySelector('.Debug'),
                intro: 'Randomly generate breakers and display it',
                position: 'right'
            },{
                element: document.querySelector('.boards'),
                intro: 'Estimations will appear here, same goes for the rest below',
                position: 'right'
            },{
                element: document.querySelector('.measurements-container'),
                intro: 'Will display <b>Total</b> Length, Width and Height <b>Measurement Displayed </b> Includes Busbar Panel, Panel stand...etc',
                position: 'right'
            },{
                element: document.querySelector('.parentimage2'),
                intro: 'Guthrie Cable Front and Cable End Panels. <b>Estimations Displayed </b> will only be areas highlighted in red',
                position: 'left'
            },{
                element: document.querySelector('.parentimage'),
                intro: 'Based on SS638, the minimum clearance between switchboard and wall',
                position: 'left'
            },{
                element: document.querySelector('.Tour'),
                title: 'End',
                intro: 'Click this if you wanna see the user guide again. Thanks',
                position:'right'
            },{
                element: document.querySelector('.Music'),
                title:'Extra',
                intro: 'Play some musics if you want, also have some special effects.',
                position: 'right'
            },{
                title: 'Important', 
                intro: '<b>Maximum displaying width is 10000mm</b>. If over the limit, estimation and measurements will be incorrect. Please split them up'
            }]

    }).start();
}

if (localStorage['intro-done'] == undefined){
    localStorage['intro-done'] = true;

    startTour();
}