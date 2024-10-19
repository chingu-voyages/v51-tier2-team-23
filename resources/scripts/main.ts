//https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
//https://stackoverflow.com/questions/11563638/how-do-i-get-the-value-of-text-input-field-using-javascript

////////////////
/* INTERFACES */
////////////////

/**
 * this is a hack - I won't be able 
 * to set TS for ES6 or later and the 
 * existing configuration was not accepting 
 * some new Array methods
 * 
 * @interface
 */
interface ArrayConstructor {

    from<T, U>(arrayLike: ArrayLike<T>, filter: (v: T, k: number) => U, thisArg?: any): Array<U>;
    from<T>(arrayLike: ArrayLike<T>): Array<T>;
}

///////////
/* TYPES */
///////////

/**
 * SelectedCellsCoord type: collect data 
 * about the coordinates of the selected cells 
 * using radio and checkboxes inputs, 
 * as well as the shown number inputs 
 * selected (editableCells)
 * 
 * @typedef SelectedCellsCoord
 * @type {object}
 * @property {?string} checkColId - an ID
 * @property {string[]} checkedRowIds - list of IDs
 * @property {number} rowCount - the last row
 * @property {NodeListOf<HTMLFormElement> | []} editableCells - list of selected number inputs
 */

type SelectedCellsCoord = {
    checkedColId: string | null,
    checkedRowIds: string[],
    rowCount: number,
    colOfEditedCells: NodeListOf<HTMLFormElement> | []
}

/** 
 * ContribsValues type: it will temporary contain 
 * the contributions so we can keep them for 
 * further maths operations 
 * 
 * @typedef ContribsValues
 * @type {object}
 * @property {number[]} newContr - a list of 3 values, in that order: [modified contribution or 0, current contribution, current contribution - modified contribution]
 * @property {boolean} edited - if the cell was edited (true) or not (false)
 */
type ContribsValues = {
    newContr:number[],
    edited:boolean

}


/**
 * updateContribs type: start as empty
 * but it will be populated with inner objects
 * with rowids as indexes.
 * The inner objects will temporary contain
 * the contributions so we can keep them for 
 * further maths operations
 * 
 * @typedef UpdatedContribs
 * @type {object}
 * @property {ContribsValues | any} - key is rowId
 */
type UpdatedContribs = {
    [index:string]: ContribsValues | any
}

/////////////////////////
/* DATA INITIALIZATION */
/////////////////////////

/**
 * FAKE DATASET 
*/
let dataset = [
{
    name: 'Quien',
    recordId: 'quien',
    paid:0,
    absolContr: null
},
{
    name: 'Como',
    recordId: 'como',
    paid:1000,
    absolContr: null
},
{
    name: 'Donde',
    recordId: 'donde',
    paid:0,
    absolContr: null
},
{
    name: 'Cuando',
    recordId: 'cuando',
    paid:0,
    absolContr: null
},
];

///////////////////////////////////
/* DATA COLLECTORS and CONSTANTS */
///////////////////////////////////

let __selectedCells: SelectedCellsCoord = {
    checkedColId: null,
    checkedRowIds: [],
    rowCount: -1,
    colOfEditedCells: []
}


let __updatedContribs:UpdatedContribs = {} 

/** 
 * @description __recordIds rows and columns Ids; class assigments
 */
let __recordIds = dataset.map((v,i)=>{return v.recordId;});
let __columnIdsIn = ['editRelSpl', 'editAbsSpl','editPaid'];
let __columnIdsOut = ['outRelSpl', 'outAbsSpl', 'outPaid', 'outAbsRem', 'outRelRem'];
let __editablesClass = 'editable';
let __editableColClass = __columnIdsIn;
let __outputsClass = 'output';
let __outputColClass = __columnIdsOut;

/** 
 * @description cTotsel collects the total allotment from the HTML (hardcoded) 
 */
let cTotsel:HTMLElement | null = document.getElementById("tot");
let cTot:number;
if(cTotsel){
    cTot = Number(cTotsel.innerHTML);
}else{
    throw('HtmlElement null');
}

/**
 * @description  __numberOfSplits will count the number of participants that were not selected by the user. We will need that info to split the remaining  
 */
let __numberOfSplits = 0;

/**
 * @description __sumNewSplit will collect the total remainings left by those with modified outputs
 */
let __sumNewSplit = 0;

/* CONSTANTS and GLOBAL-USE ELEMENTS */

let table = document.querySelector("table");

/**
 * @function
 *  * @param {string} selEditClass - a class assigned to the number inputs of the table
 * @description __getEditables function will get all editable HTML number inputs (.editable class)
 */
let __getEditables = function(selEditClass:string):NodeListOf<HTMLFormElement>{return document.querySelectorAll(selEditClass)}; 

/**
 * @function
 *  * @param {string} selEditClass - a class assigned to the number inputs of the table
 * @description __getEditables function will get all editable HTML number inputs (.editable class)
 */
let __getElemByColIds = function(selColId:string):NodeListOf<HTMLFormElement>{return document.querySelectorAll(selColId)}; 

/**
 * @function
 * @param {string} selColId
* @description __getOutputs function will get all outputs per column id
 */
let __getOutputs = function(selColId:string):NodeListOf<Element>{return document.querySelectorAll(selColId)};

/////////////////////
/* FUNCTIONALITIES */
/////////////////////

/**
 * @function 
 * @description This function runs at laoding. It completes the table with rows as records of the dataset. It also add the listeners and pre-set some of the temporary data collections.
 * 
 */
let populateFunc = function(){ //create table

    let rowCount:number;

    if(table){
        rowCount = table.rows.length;
    }else{
        throw('table was not found');
    }

    //Calculate Even Contribution: Split
    //Calculate Even Contribution: Percentage;
    let eqCon = cTot/4;
    let eqPer = eqCon*100/cTot;

    //Iterate through the dataset
    for(let rcdIdx = 0; rcdIdx < dataset.length; rcdIdx++){
        
        //insert a new row
        let rcdRow = table.insertRow(rowCount);
        rcdRow.id =  dataset[rcdIdx].recordId;

        //start populating updateContribs with the record ids as keys
        __updatedContribs[dataset[rcdIdx].recordId] = {};

        //prepare the correponding cells, specific to each column
        //it also creates the corresponding checkbox per row
        //the editable cells will contain a hidden number input form corresponding to their column
        //NOTICE THE IMPORTANCE of assigning the correpct ids and classes
        let rcdCBoxCell = rcdRow.insertCell(0);
        rcdCBoxCell.id = dataset[rcdIdx].recordId + '-checkboxCell';
        rcdCBoxCell.innerHTML = `<input type='checkbox' id='${ dataset[rcdIdx].recordId}'></input>`;

        let rcdNameCell = rcdRow.insertCell(1);
        rcdNameCell.id = dataset[rcdIdx].recordId + '-nameCell';
        rcdNameCell.innerHTML = dataset[rcdIdx].name;

        let rcdRelSplCell = rcdRow.insertCell(2);
        rcdRelSplCell.id = dataset[rcdIdx].recordId + '-relsplCell';
        rcdRelSplCell.innerHTML = `<input class='${__editablesClass} ${__editableColClass[0]}' type='number' name='spl' id='${dataset[rcdIdx].recordId}-${__columnIdsIn[0]}' data-column='${__columnIdsIn[0]}' data-row='${dataset[rcdIdx].recordId}' min='0' max='100'><span class='${__outputsClass} ${__outputColClass[0]}' id='${dataset[rcdIdx].recordId}-${__columnIdsOut[0]}' data-column='${__columnIdsOut[0]}' data-row='${dataset[rcdIdx].recordId}'>${eqPer}</span>`;

        let rcdAbsSplCell = rcdRow.insertCell(3);
        rcdAbsSplCell.id = dataset[rcdIdx].recordId + '-abssplCell';
        rcdAbsSplCell.innerHTML = `<input class='${__editablesClass} ${__editableColClass[1]}' type='number' name='spl' id='${dataset[rcdIdx].recordId}-${__columnIdsIn[1]}' data-column='${__columnIdsIn[1]}' data-row='${dataset[rcdIdx].recordId}' min='0' max='100'><span class='${__outputsClass} ${__outputColClass[1]}' id='${dataset[rcdIdx].recordId}-${__columnIdsOut[1]}' data-column='${__columnIdsOut[1]}' data-row='${dataset[rcdIdx].recordId}'>${eqCon}</span>`;

        let rcdPaidCell = rcdRow.insertCell(4);
        rcdPaidCell.id = dataset[rcdIdx].recordId + '-rcdPaidCell';
        rcdPaidCell.innerHTML = `<input class='${__editablesClass} ${__editableColClass[2]}' type='number' name='spl' id='${dataset[rcdIdx].recordId}-${__columnIdsIn[2]}' data-column='${__columnIdsIn[2]}' data-row='${dataset[rcdIdx].recordId}' min='0' max='100'><span class='${__outputsClass} ${__outputColClass[2]}' id='${dataset[rcdIdx].recordId}-${__columnIdsOut[2]}' data-column='${__columnIdsOut[2]}' data-row='${dataset[rcdIdx].recordId}'>${dataset[rcdIdx].paid}</span>`;

        let rcdAbsRemCell = rcdRow.insertCell(5);
        rcdAbsRemCell.id = dataset[rcdIdx].recordId + '-rcdAbsRemCell';
        let toPay = eqCon - dataset[rcdIdx].paid;
        rcdAbsRemCell.innerHTML = `<span class='${__outputsClass} ${__outputColClass[3]}' id='${dataset[rcdIdx].recordId}-${__columnIdsOut[3]}' data-column='${__columnIdsOut[3]}' data-row='${dataset[rcdIdx].recordId}'>${toPay}</span>`;

        let rcdRelRemCell = rcdRow.insertCell(6);
        rcdRelRemCell.id = dataset[rcdIdx].recordId + '-rcdRelRemCell';
        let toPayPer = Math.ceil(toPay*100/eqCon);
        rcdRelRemCell.innerHTML = `<span class='${__outputsClass} ${__outputColClass[4]}' id='${dataset[rcdIdx].recordId}-${__columnIdsOut[4]}' data-column='${__columnIdsOut[4]}' data-row='${dataset[rcdIdx].recordId}'>${toPayPer}</span>`;

        //go to the following row
        rowCount = table.rows.length;
    }

    //Attach event listeners (buttons)
    const editBtn = document.querySelector('#editBtn');
    const updateBtn = document.querySelector('#updateBtn');
    const saveBtn = document.querySelector('#saveBtn');
    const cancelBtn = document.querySelector('#cancelBtn');
    if(editBtn){
        editBtn.addEventListener('click', editBtnFunc);
    }else{
        throw('editt button not found');
    }
    
    if(updateBtn){
        updateBtn.addEventListener('click', updateBtnFunc);
    }else{
        throw('update button not found');
    }

    if(saveBtn){
        saveBtn.addEventListener('click', saveBtnFunc);
    }else{
        throw('save button not found');
    }
    
    if(cancelBtn){
        cancelBtn.addEventListener('click', cancelBtnFunc);
    }else{
        throw('cancel button not found');
    }
}

/**
 * @function
 * @description This function helps to determine which rows and columns have been selected by the user, storing that information for later use in the editing process
 */
function __getCheckedColRows(){
    let radios = document.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    let checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    const checkedCol = !radios? [] : Array.from(radios).filter((r,i)=>{return r.checked;});
    const checkedRows = !checkboxes? [] : Array.from(checkboxes).filter((cbox,i)=>{return cbox.checked;});

    //collect colid, rowids, length of the table and all editable cells
    if(checkedCol.length == 0 || checkedRows.length == 0){
        console.log(checkedCol, checkedRows);
        return false;
    }else{
        __selectedCells.checkedColId = checkedCol[0].id;
        __selectedCells.checkedRowIds = checkedRows.map((v,i)=> {return v.id});
        if(table){
            __selectedCells.rowCount = table.rows.length;
        }else{
            throw('table not found');
        }
        __selectedCells.colOfEditedCells = document.querySelectorAll("." + __selectedCells.checkedColId);
        return true;
    }
}

/**
 * @function
 * @description This function is an event of "Edit" button. It roles is to show the input fields for the cells the user has selected
 */
let editBtnFunc = function(){
    
    //populate __selectedCells using the __getCheckedColRows function
    let gotit:boolean=false;
    gotit = __getCheckedColRows();
    if(!gotit){
        return;
    }    

    //go through all editable cells; if marked as selected, display the Edit field
    let editables = __getEditables('.editable');
    for(let editIdx = 0; editIdx < editables.length; editIdx++){

        //using the HTML dataset attribute
        let editableRowID:string|undefined = editables[editIdx].dataset.row;
        let editableColID:string|undefined = editables[editIdx].dataset.column;

        if(editableRowID != undefined && editableColID != undefined){
            if( __selectedCells.checkedRowIds.indexOf(editableRowID) != -1 && editableColID === __selectedCells.checkedColId){
                editables[editIdx].style.display = 'inline-block';
            }else{
                editables[editIdx].style.display = 'none';
            }
        }
    }

    const updateBtn = document.querySelector('#updateBtn') as HTMLFormElement;
    const cancelBtn = document.querySelector('#cancelBtn') as HTMLFormElement;
    const saveBtn = document.querySelector('#saveBtn') as HTMLFormElement;

    if(updateBtn){
        updateBtn.hidden = false;
    }else{
        throw('update button not found');
    }
    
    if(saveBtn){
        saveBtn.hidden = true;
    }else{
        throw('save button not found');
    }

    if(cancelBtn){
        cancelBtn.hidden = false;
    }else{
        throw('cancel button not found');
    }
}

/**
 * @function
 * @param {NodeListOf<Element>} selOutput
 * @description This function updates the following global variables:
---  __updatedContribs object with the new values of the edited / non-edited cells by row (id);
--- count the number of non-edited participants (__numberOfSplits)
--- and after getting all the data calculates the __sumNewSplit value
*/
let __newContrAndSumSpltFunc = function(selOutput:NodeListOf<Element>){

    // get data from edited cells and keep it in __updatedContribs
    for(let editedIdx = 0; editedIdx <  __selectedCells.colOfEditedCells.length; editedIdx++){
        
        //using the HTML dataset attribute
        let editableRowID:string|undefined = __selectedCells.colOfEditedCells[editedIdx].dataset.row;

        //just check if there is a value to see if edited
        if(editableRowID != undefined){
            if(__selectedCells.colOfEditedCells[editedIdx].value != ''){
                __updatedContribs[editableRowID].newContr = [Number(__selectedCells.colOfEditedCells[editedIdx].value)];
                __updatedContribs[editableRowID].edited = true;
            }else{
                __updatedContribs[editableRowID].newContr = [Number(selOutput[editedIdx].innerHTML)];
                __updatedContribs[editableRowID].edited = false;
                //count this one another participant that will receive an new split
                __numberOfSplits += 1;
            }
        }
    }

    //get current contr value and make a first calculation of the differences for the selected participants
    //keep the value as 0 for the not selected ones
    for(let outputIdx = 0; outputIdx <  selOutput.length; outputIdx++){
        
        //using the HTML dataset attribute
        //OBSERVATION: Element type doesn't recognised the dataset attribute, so I had to use getAttribute method instead of dot format
        //Notice also that for this approach the non-value is "null", while for dot format was "undefined"
        let outputRowID:string|null = selOutput[outputIdx].getAttribute('data-row');

        if(outputRowID != null){
            __updatedContribs[outputRowID].newContr.push(Number(selOutput[outputIdx].innerHTML));
            if(__selectedCells.checkedRowIds.indexOf(outputRowID) != -1){
                __updatedContribs[outputRowID].newContr.push(__updatedContribs[outputRowID].newContr[1]-__updatedContribs[outputRowID].newContr[0]);
            }else{
                __updatedContribs[outputRowID].newContr.push(0);
            }
        }
    }

    //__sumNewSplit functionality is IMPORTANT
    //the function collect and sum the remainings left by the edited participants
    //this remaining is the one that will be evenly splitted between the rest of the participants
    //which are summed in __numberOfSplits counter 
    __sumNewSplit = Object.keys(__updatedContribs).map((k,i)=>{if(__updatedContribs[k].edited){return __updatedContribs[k].newContr[2]}}).filter((v,i)=>{return v != undefined}).reduce((acc, b)=>{return acc+b});
}

/**
 * @function
 * @description This function is an event of "Update" button. It roles is to collect the inputs by the user recalculate the values and update the whole 
 * table accordingly before resetting all the temporary data collectors
*/
let updateBtnFunc = function(){

/**
 * @function
 * @param {string} colID - either editRelSpl or editAbsSpl
 * @description This inner function is to reduce redundancy in the assignment of output values when the user edit relative or absolute splits
*/
    let __absOrrelSplFunc = function(colID:string){
        for(let recordID in __updatedContribs){ //just remember that recordID === rowID
            for(let outputIdx = 0; outputIdx < __outsEdit.length; outputIdx++) {
        
                //using the HTML dataset attribute
                //OBSERVATION: Element type doesn't recognised the dataset attribute, so I had to use getAttribute method instead of dot format
                //Notice also that for this approach the non-value is "null", while for dot format was "undefined"
                let outRowID:string|null = __outsEdit[outputIdx].getAttribute('data-row');
                if(outRowID != null){
                    if(outRowID == recordID){
                        if(__updatedContribs[recordID].edited){
                            __outsEdit[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[recordID].newContr[0]));
                            //NOTICE there is a conversion of relative values to absolute to reuse previous code
                            if(colID == 'editRelSpl'){
                                __updatedContribs[recordID].newContr = __updatedContribs[recordID].newContr.map((v:number,i:number)=>{return Math.ceil(v/100*cTot)});
                                __outsToSpl[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[recordID].newContr[0]));
                            }else{
                                __outsToSpl[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[recordID].newContr[0]*100/cTot));
                            }
                            __outsAbsRem[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[recordID].newContr[0] - Number(__outsPaid[outputIdx].innerHTML)));
                            __outsRelRem[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[recordID].newContr[0] - Number(__outsPaid[outputIdx].innerHTML))*100/__updatedContribs[recordID].newContr[0]));
                        }else{
                            //notice how the even split is made for the non-selected participants
                            __outsEdit[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[recordID].newContr[1] + __sumNewSplit/__numberOfSplits));
                            //NOTICE there is a conversion of relative values to absolute to reuse previous code
                            let __redoNewSplit:number;
                            if(colID == 'editRelSpl'){
                                __updatedContribs[recordID].newContr = __updatedContribs[recordID].newContr.map((v:number,i:number)=>{return Math.ceil(v/100*cTot)});
                                __redoNewSplit = Math.ceil(__sumNewSplit*cTot/100);
                                __outsToSpl[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[recordID].newContr[1] + __redoNewSplit/__numberOfSplits)));
                                __outsAbsRem[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[recordID].newContr[1] + __redoNewSplit/__numberOfSplits - Number(__outsPaid[outputIdx].innerHTML)));
                                __outsRelRem[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[recordID].newContr[1] + __redoNewSplit/__numberOfSplits - Number(__outsPaid[outputIdx].innerHTML))*100/(__updatedContribs[recordID].newContr[1] + __redoNewSplit/__numberOfSplits)));                            
                            }else{
                                __outsToSpl[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[recordID].newContr[1] + __sumNewSplit/__numberOfSplits)*100/cTot));
                                __outsAbsRem[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[recordID].newContr[1] + __sumNewSplit/__numberOfSplits - Number(__outsPaid[outputIdx].innerHTML)));
                                __outsRelRem[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[recordID].newContr[1] + __sumNewSplit/__numberOfSplits - Number(__outsPaid[outputIdx].innerHTML))*100/(__updatedContribs[recordID].newContr[1] + __sumNewSplit/__numberOfSplits)));
                            }
                        }
                    }
                }
            }
        }
    }

    //it is time to update the outputs; we collect the corresponding columns
    //We will iterate through one of them and use the same indexing to update
    //the other ones

    let __outsEdit:NodeListOf<Element>;
    let __outsToSpl:NodeListOf<Element>; 
    let __outsPaid = __getOutputs('.outPaid');
    let __outsAbsRem = __getOutputs('.outAbsRem');
    let __outsRelRem = __getOutputs('.outRelRem');
    
    if(__selectedCells.checkedColId == 'editPaid'){
        
        // get data from edited and NOT edited cells and keep it in __updatedContribs
        __outsEdit = __getOutputs('.outPaid');
        __outsToSpl = __getOutputs('.outAbsSpl');

        for(let editedIdx = 0; editedIdx <  __selectedCells.colOfEditedCells.length; editedIdx++){

            //just check if there is a value to see if edited
            //if edited, calculate the corresponding differences
            //do nothing is not edited
            if(__selectedCells.colOfEditedCells[editedIdx].value != ''){
                __outsPaid[editedIdx].innerHTML = String(Math.ceil(__selectedCells.colOfEditedCells[editedIdx].value));
                __outsAbsRem[editedIdx].innerHTML = String(Math.ceil(Number(__outsToSpl[editedIdx].innerHTML) - parseInt(__selectedCells.colOfEditedCells[editedIdx].value)));
                __outsRelRem[editedIdx].innerHTML = String(Math.ceil((Number(__outsToSpl[editedIdx].innerHTML) - parseInt(__selectedCells.colOfEditedCells[editedIdx].value))*100/Number(__outsToSpl[editedIdx].innerHTML)));
            }
        }
    }

    //is the AbsSpl col edited?
    if(__selectedCells.checkedColId == 'editAbsSpl'){
        
        //get output of AbsSplt
        __outsEdit = __getOutputs('.outAbsSpl');
        __outsToSpl = __getOutputs('.outRelSpl');
        //update __updatedContrbs obj, __numberOfSplits and __sumNewSplit
        __newContrAndSumSpltFunc(__outsEdit);

        __absOrrelSplFunc(__selectedCells.checkedColId);

    }
    
    //NOTICE that comments are very similar as for editAbsSpl, with a small difference at the moment of updating the values of the table...
    if(__selectedCells.checkedColId == 'editRelSpl'){
        
        //get output of RelSplt
        __outsEdit = __getOutputs('.outRelSpl');
        __outsToSpl = __getOutputs('.outAbsSpl');        
        //update __updatedContrbs obj, __numberOfSplits and __sumNewSplit
        __newContrAndSumSpltFunc(__outsEdit);
  
        __absOrrelSplFunc(__selectedCells.checkedColId);
    }

    //reset all global variables to initial
    __selectedCells = {
        checkedColId: null,
        checkedRowIds: [],
        rowCount: -1,
        colOfEditedCells: []
    }
    
    __updatedContribs = {}
    for(let rcdIdIdx = 0; rcdIdIdx < __recordIds.length; rcdIdIdx++){
        __updatedContribs[__recordIds[rcdIdIdx]] = {};
    }

    __numberOfSplits = 0;
    __sumNewSplit = 0;

    //reset all checked boxes and radios to unchecked
    document.querySelectorAll('input[type="radio"]')
    let radios = document.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    let checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    radios.forEach((v,i)=>{if(v.checked){v.checked = false}});
    checkboxes.forEach((v,i)=>{if(v.checked){v.checked = false}});
    __getEditables('.editable').forEach((v,i)=>{v.style.display = 'none'; v.value = '';});

    const updateBtn = document.querySelector('#updateBtn') as HTMLFormElement;
    const saveBtn = document.querySelector('#saveBtn') as HTMLFormElement;

    if(updateBtn){
        updateBtn.hidden = true;
    }else{
        throw('update button not found');
    }

    if(saveBtn){
        saveBtn.hidden = false;
    }else{
        throw('save button not found');
    }

}

let saveBtnFunc = function(){

    const updateBtn = document.querySelector('#updateBtn') as HTMLFormElement;
    const saveBtn = document.querySelector('#saveBtn') as HTMLFormElement;
    const cancelBtn = document.querySelector('#cancelBtn') as HTMLFormElement;
    
    if(updateBtn){
        updateBtn.hidden = true;
    }else{
        throw('update button not found');
    }

    if(saveBtn){
        saveBtn.hidden = true;
    }else{
        throw('save button not found');
    }

    if(cancelBtn){
        cancelBtn.hidden = true;
    }else{
        throw('cancel button not found');
    }

    alert('All the changes were saved!');

}


let cancelBtnFunc = function(){
    //reset all global variables to initial
    __selectedCells = {
        checkedColId: null,
        checkedRowIds: [],
        rowCount: -1,
        colOfEditedCells: []
    }
    
    __updatedContribs = {}
    for(let rcdIdIdx = 0; rcdIdIdx < __recordIds.length; rcdIdIdx++){
        __updatedContribs[__recordIds[rcdIdIdx]] = {};
    }

    __numberOfSplits = 0;
    __sumNewSplit = 0;

    //reset all checked boxes and radios to unchecked
    document.querySelectorAll('input[type="radio"]')
    let radios = document.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    let checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    radios.forEach((v,i)=>{if(v.checked){v.checked = false}});
    checkboxes.forEach((v,i)=>{if(v.checked){v.checked = false}});
    __getEditables('.editable').forEach((v,i)=>{v.style.display = 'none'; v.value = '';}); 

    const updateBtn = document.querySelector('#updateBtn') as HTMLFormElement;
    const saveBtn = document.querySelector('#saveBtn') as HTMLFormElement;
    const cancelBtn = document.querySelector('#cancelBtn') as HTMLFormElement;
    
    if(updateBtn){
        updateBtn.hidden = true;
    }else{
        throw('update button not found');
    }

    if(saveBtn){
        saveBtn.hidden = true;
    }else{
        throw('update button not found');
    }

    if(cancelBtn){
        cancelBtn.hidden = true;
    }else{
        throw('update button not found');
    }

    alert('All the changes were cancelled!');
}

window.onload = function(){
    populateFunc();
}