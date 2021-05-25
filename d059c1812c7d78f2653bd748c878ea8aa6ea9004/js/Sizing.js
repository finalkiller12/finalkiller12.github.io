
// change these numbers when you want to resize
// also remember to change .canvas-container's dimensions too
const canvas_size = [
    { width: 2000, height: 280 },
    { width: 2000, height: 280 },
    { width: 2000, height: 280 },

];

const relays = [
    { name: 'Relay', height: 1800,  width: 30 },
    { name: 'Relay', height: 400,   width: 60 }
]

const breakers = {
    guthrie: [
        { name: 'MCCB-100',         height: 400, width: 60 },
        { name: 'MCCB-160',         height: 400, width: 60 },
        { name: 'MCCB-250',         height: 400, width: 60 },
        { name: 'MCCB-400',         height: 400, width: 60 },
        { name: 'MCCB-630',         height: 600, width: 60 },
        { name: 'MCCB-800',         height: 600, width: 60 },
        { name: 'ACB-1000',        height: 1800, width: 60 },
        { name: 'ACB-1250',        height: 1800, width: 70 },
        { name: 'ACB-1600',        height: 1800, width: 70 },
        { name: 'ACB-2000',        height: 1800, width: 80 },
        { name: 'ACB-2500',        height: 1800, width: 80 },
        { name: 'ACB-3200',        height: 1800, width: 80 },
        { name: 'ACB-4000',        height: 1800, width: 81 }, //Reduce width from 120 --> 81
        { name: 'ACB-5000',        height: 1800, width: 81 }, //As it take up to much space and looks weird when drawn tgt
        { name: 'ACB-6300',        height: 1800, width: 81 }, //Display of text and measurement for 'wdith' will +39 to calculation to get 120
    ],
    xyz: [
        { name: 'MCCB-100',         height: 400, width: 60 },
        { name: 'MCCB-160',         height: 400, width: 60 },
        { name: 'MCCB-250',         height: 400, width: 60 },
        { name: 'MCCB-400',         height: 400, width: 60 },
        { name: 'MCCB-630',         height: 600, width: 60 },
        { name: 'MCCB-800',         height: 600, width: 60 },
        { name: 'ACB-1000',        height: 1800, width: 60 },
        { name: 'ACB-1250',        height: 1800, width: 70 },
        { name: 'ACB-1600',        height: 1800, width: 70 },
        { name: 'ACB-2000',        height: 1800, width: 80 },
        { name: 'ACB-2500',        height: 1800, width: 80 },
        { name: 'ACB-3200',        height: 1800, width: 80 },
        { name: 'ACB-4000',        height: 1800, width: 81 },
        { name: 'ACB-5000',        height: 1800, width: 81 },
        { name: 'ACB-6300',        height: 1800, width: 81 },
    ],
    xyza: [
        { name: 'MCCB-100',         height: 400, width: 60 },
        { name: 'MCCB-160',         height: 400, width: 60 },
        { name: 'MCCB-250',         height: 400, width: 60 },
        { name: 'MCCB-400',         height: 400, width: 60 },
        { name: 'MCCB-630',         height: 600, width: 60 },
        { name: 'MCCB-800',         height: 600, width: 60 },
        { name: 'ACB-1000',        height: 1800, width: 60 },
        { name: 'ACB-1250',        height: 1800, width: 70 },
        { name: 'ACB-1600',        height: 1800, width: 70 },
        { name: 'ACB-2000',        height: 1800, width: 80 },
        { name: 'ACB-2500',        height: 1800, width: 80 },
        { name: 'ACB-3200',        height: 1800, width: 80 },
        { name: 'ACB-4000',        height: 1800, width: 81 },
        { name: 'ACB-5000',        height: 1800, width: 81 },
        { name: 'ACB-6300',        height: 1800, width: 81 },
    ],
    incoming: [
        { name: '600 MCCB', display: 'Incoming\n600 MCCB',      height: 1800, width: 70 },
        { name: '1000 ACB', display: 'Incoming\n1000 ACB',      height: 1800, width: 70 },
        { name: '1250 ACB', display: 'Incoming\n1250 ACB',      height: 1800, width: 70 },
        { name: '1600 ACB', display: 'Incoming\n1600 ACB',      height: 1800, width: 70 },
        { name: '2000 ACB', display: 'Incoming\n2000 ACB',      height: 1800, width: 80 },
        { name: '2500 ACB', display: 'Incoming\n2500 ACB',      height: 1800, width: 80 },
        { name: '3200 ACB', display: 'Incoming\n3200 ACB',      height: 1800, width: 80 },
        { name: '4000 ACB', display: 'Incoming\n4000 ACB',      height: 1800, width: 81 },
        { name: '5000 ACB', display: 'Incoming\n5000 ACB',      height: 1800, width: 81 },
        { name: '6300 ACB', display: 'Incoming\n6300 ACB',      height: 1800, width: 81 },
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
        let newGroups = groups.filter(x => x.length != 0);
        let singleBlockCols = newGroups.filter(x => x.length == 1 && sum(x.map(y => y.height)) == this.column.limit);
        let multiBlockCols = newGroups.filter(x => x.length > 1 || sum(x.map(y => y.height))!= this.column.limit);

        let justInserted = false;
        for (let i = 0; i < multiBlockCols.length; i++){
            if (justInserted){
                justInserted = false;
            } else {

                let heightSum = multiBlockCols[i].map(a => a.height);
                let potentialCombinedHeight = sum(heightSum.concat(relays[1].height)) // add small relay
                if (potentialCombinedHeight > this.column.limit) { // small relay does not fit

                    const newColumn = [ relays[0] ];
                    const index = i + 1;
                    multiBlockCols.splice(index, 0, newColumn) // insert big relay to the right

                    justInserted = true;
                    i++; // this will counter how inserting a big relay will push all later indexes down by one
                }
                else if (potentialCombinedHeight <= this.column.limit){ // non empty column

                    multiBlockCols[i].splice(1, 0, relays[1])

                    justInserted = true;
                }
            }
        }

        newGroups = singleBlockCols.concat(multiBlockCols);

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

    insertIncoming(blocks, incoming){
        /*
        if only 1 incoming selected
        
            single and multi    > place in between them
            only multi          > place where no relays will be adjacent
            only 1 block        > place on right

        if 2 incoming (normally same size) selected

            a busbar (coupler) of the same size need to be inserted in the middle of both incoming
        */

        let content;

        if (incoming.length == 1){ // second selection is empty
            content = [ [incoming[0]] ];
        }
        else if (incoming.length == 2){
            let busbar = { name: 'Bus-Coupler', height: incoming[0].height, width: incoming[0].width }; 
            content = [ [incoming[0]], [busbar], [incoming[1]] ];
        }
        /*
        else if (incoming.length == 3){
            let busbar = { name: 'Busbar', height: incoming[0].height, width: incoming[0].width }; 
            content = [ [incoming[0]], [busbar], [incoming[1]], [busbar], [incoming[2]]];
        }
        else {
            let busbar = { name: 'Busbar', height: incoming[0].height, width: incoming[0].width }; 
            content = [ [incoming[0]], [busbar], [incoming[1]], [busbar],[incoming[2]], [busbar], [incoming[3]]];
        }
        */
        const singleBlockCols = blocks.filter(x => x.length == 1 && sum(x.map(y => y.height)) == this.column.limit && x[0].name != 'Relay');
        const multiBlockCols = blocks.filter(x => x.length > 1 || sum(x.map(y => y.height))!= this.column.limit || x[0].name == 'Relay');

        if (blocks.length == 1){
            blocks = blocks.concat(content);
        } 
        else if (singleBlockCols.length == 0){
            let index;
            for (let i = 1; i < blocks.length; i++){
                if (blocks[i-1][0].name != 'Relay' && blocks[i][0].name != 'Relay'){
                    // note: doesnt check for small relay
                    index = i;
                    break;
                }
            }
            console.log(`inserting at index: ${index}`);
            if (index != undefined){
                blocks.splice(index, 0, ...content)
            }
        } 
        else{
            blocks = singleBlockCols.concat(content, multiBlockCols);
        }
            
        return blocks;
    }

    calcDrawingWidth(blocks) {
        let width = 0;
        let width_81 = 0;
        let widthTotal = 0;

        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].length > 0) { // column not empty
                

                    if(blocks[i][0].width != 81) {
                        width += blocks[i][0].width + this.column.spacing*2; // column's first unit's width + spacing
                        // this will count extra spacing for last column
                    }
                    else{
                        width_81 += blocks[i][0].width + 39;
                    }
                    widthTotal = width_81 + width;
            }
        }
        
        return (widthTotal*10)
    }

    displayMeasurements(blocks){
        const width = this.calcDrawingWidth(blocks);
        this.measurementDisplay.textContent = `Overall Dimension (Including Busbar Panel..etc): Depth = 800 , Length = ${width} , Height = 2275`;
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

                    /*if (this.calcDrawingWidth(blocks) < 9700){*/
                    const block_height = blocks[col][j].height / scaling_factor - vertical_spacing;
                    
                    
                    // draw the unit  
                    ctx.fillStyle = "rgba(255,0,0,0.5)";
                    ctx.fillRect(currentPos.x - (thickness), currentPos.y - (thickness), blocks[col][j].width + (thickness*2), block_height + (thickness*2));
                    
                    // write centered text
                    let textToUse = '';
                    if (blockText == 'breakerrating') {
                        if (blocks[col][j].display == undefined){
                            textToUse = blocks[col][j].name;
                        } else {
                            textToUse = blocks[col][j].display;
                        }
                    } 
                    else if (blockText == 'width') {                               //Reduce width from 120 --> 81
                        if(blocks[col][j].width == 81){                            //As it take up to much space and looks weird when drawn tgt
                            textToUse = String( ((blocks[col][j].width)+39)*10 );  //Display of text and measurement for 'wdith' will +39 to calculation to get 120
                        }
                        else{
                            textToUse = String( blocks[col][j].width*10 );
                        }
                       
                    }       
                    else if (blockText == 'height') {
                        textToUse = String(blocks[col][j].height);
                    }
                    ctx.fillStyle = "black";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.font = "10px Arial";
                    // ctx.fillText(textToUse, currentPos.x + (blocks[col][j].width / 2), currentPos.y + (block_height / 2));
                    fillTextMultiLine(ctx, textToUse, currentPos.x + (blocks[col][j].width / 2), currentPos.y + (block_height / 2));
                    
                    currentPos.y += block_height + vertical_spacing; // start the next drawing lower down
                
                    /*else{
                        alert("Excceed 10000mm wdith. Not all Breakers will be shown. Measurement will be incorrect. Please reduce the Quantity of breakers");
                        return false;
                    }*/
                
                }
            }
        }
    }
}

// https://stackoverflow.com/questions/5026961/html5-canvas-ctx-filltext-wont-do-line-breaks
function fillTextMultiLine(ctx, text, x, y) {
    var lineHeight = ctx.measureText("M").width * 1.4;
    var lines = text.split("\n");
    for (var i = 0; i < lines.length; ++i) {
      ctx.fillText(lines[i], x, y);
      y += lineHeight;
    }
  }

function gatherUnitIncoming(){
    const selects = document.getElementsByClassName('incoming-position');
    let values = [];
    for (let i = 0; i < selects.length; i++) {
        values.push(selects[i].value);
    }
    return values;
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
    const incoming = gatherUnitIncoming();
    const incomingUnits = incoming.map(unit => {
        return breakers.incoming.filter(obj => {return obj.name == unit})[0];
    }).filter(unit => { return unit != undefined});
 
    const blockText = document.getElementById('block-text').value.toLowerCase();

    for (let i = 0; i < estimations.length; i++) {
        estimations[i].clearCanvas();

        const units = countUnits(quantities, estimations[i].name);
        const blocks = estimations[i].groupUnits(units);
        const blocksWithRelays = estimations[i].insertRelays(blocks);
        const paddedBlocks = estimations[i].emptySpace(blocksWithRelays);

        let finalBlocks;
        if (incomingUnits.length > 0){
            finalBlocks = estimations[i].insertIncoming(paddedBlocks, incomingUnits);
        } else {
            finalBlocks = paddedBlocks;
        }

        estimations[i].displayMeasurements(finalBlocks);
        estimations[i].drawBreakers(finalBlocks, blockText);
    }
})
/// main program end lol

// button events

document.getElementById('random-qty-btn').addEventListener('click', function () {
    const outgoingSelects = document.getElementsByClassName('select-position');
    const incomingSelects = document.getElementsByClassName('incoming-position');
 
    for (let i = 0; i < outgoingSelects.length; i++) {
        let value = parseInt(Math.random()*6);
        if (breakers['guthrie'][i].height == 1800){
            value = 0; // dont set tallest units cus they dont help with testing
        }
        outgoingSelects[i].value = value;
    }

    const incomingNames= breakers.incoming.map(x => x.name);
    for (let i = 0; i < incomingSelects.length; i++) {
        let value = incomingNames[Math.floor(Math.random() * incomingNames.length)]; // random value in array
        incomingSelects[i].value = value;
    }
})

document.getElementById('reset-btn').addEventListener('click', function() {
    const outgoingSelects = document.getElementsByClassName('select-position');
    const incomingSelects = document.getElementsByClassName('incoming-position');

    for (let i = 0; i < outgoingSelects.length; i++) {  
        outgoingSelects[i].selectedIndex = 0;
    }
    for (let i = 0; i < incomingSelects.length; i++) {  
        incomingSelects[i].selectedIndex = 0;
    } 

    estimate_btn.click();
})

document.getElementById('Intro-btn').addEventListener('click', function() {
    startTour();
})

document.getElementById('Save-btn').addEventListener('click', function() {
    const data = {
        outgoing: gatherUnitSelections(),
        incoming: gatherUnitIncoming()
    }
    localStorage['quantities'] = JSON.stringify(data);
    
})  

document.getElementById('Load-btn').addEventListener('click', function(){
    const data = JSON.parse(localStorage['quantities']);
    const outgoingSelects = document.getElementsByClassName('select-position');
    const incomingSelects = document.getElementsByClassName('incoming-position');

    for (let i = 0; i < outgoingSelects.length; i++) {
        outgoingSelects[i].value = data.outgoing[i];
    }
    for (let i = 0; i < incomingSelects.length; i++) {
        incomingSelects[i].value = data.incoming[i];
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
                intro:'Please follow the guide for 1st timer <br/><br/> <b>2 mintues</b> of your time only.'
            },{
                title:'Remainder',
                intro: 'Reference taken from Guthrie and Gathergates. <br/><br/><b>Note:</b><br/> Strictly for <b>Form 3B</b> only',
            },{
                title: 'Very Important',
                intro: '<b>Assumptions:</b><br/> ACB already have relays on their panels. <br/><br/> Thus, no relays will be insert beside them.',    
            },{
                element: document.querySelectorAll('.sidebar-group')[0],
                title:'Outgoing Breakers',
                intro: 'Based on your SLD,<br/> select your <b>Outgoing</b> breaker ratings.',
                position: 'right' 
            },{
                element: document.querySelectorAll('.sidebar-group')[1], 
                title:'Incoming Supply',
                intro: 'Based on your SLD,<br/> select your <b>Incoming</b> breaker ratings. <br/><br/><b>Note:</b><br/>If 2 incoming are selected, <br/><b>Bus-Coupler</b> will be insert automactically. <br/><br/>Else no Bus-coupler',
                position: 'right' 
            },{
                element: document.querySelector('.Option-Drawing'),
                title:'Text in drawing',
                intro: 'Choose 1 options <br/> Text will appear accordingly <br/>(Breaker Rating, Height, Length) <br/><b><br/> Note:<br/></b> Remember to click <b>`Draw`</b> to display the new text change.',
                position: 'right'
            },{
                element: document.querySelector('.Calculation'),
                title:'Estimation',
                intro: 'Click <b> Draw </b> to display drawing. <br/> Click <b> Reset </b> to clear all, reset everything to 0.',
                position: 'right'
            },{
                element: document.querySelector('.parentimage2'),
                title:'Switchboard Panel',
                intro: 'Guthrie Cable Front and Cable End Panels. <br/><br/><b>Estimated drawings </b> will only be areas highlighted in red.',
                position: 'left'
            },{
                element: document.querySelector('.measurements-container'),
                title:'Measurement',
                intro: 'Will display <b>Total</b> Depth, Length and Height <b><br/><br/>Measurement Displayed </b> Includes Busbar Panel, Panel stand...etc.',
                position: 'right'
            },{
                element: document.querySelector('.parentimage'),
                title:'Singapore Standard',
                intro: 'Based on SS638,<br/><br/><b>Minimum clearance</b> between switchboard and wall are indicated in the image.<br/><br/> Can use it for references.',
                position: 'left'            
            },{
                element: document.querySelector('.Debug'),
                title:'Random Generator',
                intro: 'Generate random numbers of outgoing breakers <br/>(100 MCCB - 800MCCB) & <br/> incoming breakers <br/><br/><b><br/> Note:<br/></b> Remember to click <b>`Draw`</b> to display it.',
                position: 'right'
            },{
                element: document.querySelector('.Save'),
                title: 'Caution',
                intro: 'Able to <b>save 1 x combination</b>,<br/> and <b>load</b> it even after refreshing the page. Without needing to select it 1 by 1 all over again. <br/><br/> <b>Note:</b><br/> Saving another combination will delete the previous 1.',
                position:'right'
            }/*,{
                element: document.querySelector('.Music'),
                title:'Extra',
                intro: 'Play some musics if you want, also have some special effects.',
                position: 'right'
            }*/,{
                title: 'Important',
                intro: 'Click on <b>`Start Tour`</b> at the top header if you wanna see the guide again. Thanks.',    
            },{
                title:'Last Remainder',
                intro: 'This is for reference only, acutal dimension might differ slightly.',
            }]

    }).start();
}

startTour();

/*if (localStorage['intro-done'] == undefined){
    localStorage['intro-done'] = true;

    startTour();
}*/

// Get the modal Results
var modal = document.getElementById("myModal");
//var modal2 = document.getElementById("catModal");

// Get the button that opens the modal
var result = document.getElementById("result-Btn");
//var catalogue = document.getElementById("catalogue-Btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
//var span2 = document.getElementsByClassName("close")[1];

// When the user clicks the button, open the modal 
let isFirstModalClick = true;
result.onclick = function() {
    modal.style.display = "block";

    if (isFirstModalClick){
        isFirstModalClick = false;

        let script = document.createElement("script");
        script.type = "text/javascript";

        script.src = "https://onedrive.live.com/embed?resid=8E98B898C211FF23%21813&authkey=%21APXH2PE-7R7_VkU&em=3&wdItem=%22'Sheet1'!A1%3AG36%22&wdDivId=%22myExcelDiv%22&wdDownloadButton=1&wdHideGridlines=1&wdAllowInteractivity=0"; 
        document.getElementsByTagName("head")[0].appendChild(script);
    }
}

/* When the user clicks the button, open the modal 
catalogue.onclick = function() {
    modal2.style.display = "block";
}*/

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
/*span2.onclick = function() {
    modal2.style.display = "none";
  }*/

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal)  {
    modal.style.display = "none";
    }
  /*if (event.target == modal2) {
    modal2.style.display = "none";
   }*/
}

  jQuery(function($){
    // runs on page load
    $(document).ajaxSend(function() {
      $("#overlay").fadeIn(300);　
    });
          
    let firstExcelLoad = true;
    $('#result-Btn').click(function(){
        // only trigger for the load event, disable itself afterwards
        if (!firstExcelLoad){
            return 
        } else {
            firstExcelLoad = false;
        }
        $.ajax({
            type: 'GET',
            success: function(data){
            console.log(data);
            }
        }).done(function() {
            var checkExist = setInterval(function() {
                if ($('iframe').length) {
                    clearInterval(checkExist);
                    // stop loading animation here
                    $("#overlay").fadeOut('fast');
                }
             }, 100); // check every 100ms
        });
    });	
  });

