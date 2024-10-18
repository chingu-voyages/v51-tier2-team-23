//https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
//https://stackoverflow.com/questions/11563638/how-do-i-get-the-value-of-text-input-field-using-javascript

////////////////
/* INTERFACES */
////////////////

/* interface ArrayConstructor: this is a hack - 
I won't be able to set TS for ES6 or later and 
the existing configuration was not accepting 
some new Array methods */
interface ArrayConstructor {

    from<T, U>(arrayLike: ArrayLike<T>, filter: (v: T, k: number) => U, thisArg?: any): Array<U>;
    from<T>(arrayLike: ArrayLike<T>): Array<T>;
}

///////////
/* TYPES */
///////////

/* SelectedCellsCoord type: collect data 
about the coordinates of the selected cells 
using radio and checkboxes inputs, 
as well as the shown number inputs 
selected (editableCells) */
type SelectedCellsCoord = {
    checkedColId: string | null,
    checkedRowIds: String[],
    rowCount: number,
    editableCells: NodeListOf<HTMLFormElement> | []
}

/* ContribsValues type: it will temporary contain
the contributions so we can keep them for 
further maths operations */

type ContribsValues = {
    newContr:number[],
    edited:boolean

}

/* updateContribs type: start as empty
but it will be populated with inner objects
with rowids as indexes.
The inner objects will temporary contain
the contributions so we can keep them for 
further maths operations */

type UpdatedContribs = {
    [index:string]: ContribsValues | any
}

/////////////////////////
/* DATA INITIALIZATION */
/////////////////////////

/* FAKE DATASET */
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

/* __selectedCells object is type SelectedCellsCoord */
let __selectedCells: SelectedCellsCoord = {
    checkedColId: null,
    checkedRowIds: [],
    rowCount: -1,
    editableCells: []
}


/* __updateContribs object: start as empty
but it will be populated with inner objects
with row ids as key.
The inner objects will temporary contain
the contributions so we can keep them for 
further maths operations */
let __updatedContribs:UpdatedContribs = {} 

/* __recordIds rows Ids */
let __recordIds = dataset.map((v,i)=>{return v.recordId;});

__recordIds
let cTotsel:HTMLElement | null = document.getElementById("tot");
let cTot:number;
if(cTotsel){
    cTot = Number(cTotsel.innerHTML);
}else{
    throw('HtmlElement null');
}

/* __numberOfSplits will count the number of participants
that were not selected by the user. We will need that info
to split the remaining  */
let __numberOfSplits = 0;
let __sumNewSplit = 0;

/* CONSTANTS and GLOBAL-USE ELEMENTS */

let table = document.querySelector("table");

/*__getEditables function will get all editable inputs (.editable class) */
let __getEditables = function():NodeListOf<HTMLFormElement>{return document.querySelectorAll('.editable')}; 

/*__getOutputs function will get all outputs per column id */
let __getOutputs = function(selColId:string):NodeListOf<Element>{return document.querySelectorAll(selColId)};

/////////////////////
/* FUNCTIONALITIES */
/////////////////////

/*
populatedFunc function:

This function runs at laoding.
It completes the table with rows
as records of the dataset.
It also add the listeners and 
pre-set some of the temporary 
data collections.
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
        rcdCBoxCell.headers = 'checkboxesTbCol';
        rcdCBoxCell.innerHTML = `<input type='checkbox' id='${ dataset[rcdIdx].recordId}-checkbox'></input>`;

        let rcdNameCell = rcdRow.insertCell(1);
        rcdNameCell.id = dataset[rcdIdx].recordId + '-nameCell';
        rcdNameCell.headers = 'namesTbCol';
        rcdNameCell.innerHTML = dataset[rcdIdx].name;

        let rcdRelSplCell = rcdRow.insertCell(2);
        rcdRelSplCell.id = dataset[rcdIdx].recordId + '-relsplCell';
        rcdRelSplCell.headers = 'editRelSpl';
        rcdRelSplCell.innerHTML = `<input class='editable editRelSpl' type='number' name='spl' id='${dataset[rcdIdx].recordId}-editRelSpl' min='0' max='100'><span class='output outRelSpl' id='${dataset[rcdIdx].recordId}-outRelSpl'>${eqPer}</span>`;

        let rcdAbsSplCell = rcdRow.insertCell(3);
        rcdAbsSplCell.id = dataset[rcdIdx].recordId + '-abssplCell';
        rcdAbsSplCell.headers = 'editAbsSpl';
        rcdAbsSplCell.innerHTML = `<input class='editable editAbsSpl' type='number' name='spl' id='${dataset[rcdIdx].recordId}-editAbsSpl' min='0' max='100'><span class='output outAbsSpl' id='${dataset[rcdIdx].recordId}-outAbsSpl'>${eqCon}</span>`;

        let rcdPaidCell = rcdRow.insertCell(4);
        rcdPaidCell.id = dataset[rcdIdx].recordId + '-rcdPaidCell';
        rcdPaidCell.headers = 'editPaid';
        rcdPaidCell.innerHTML = `<input class='editable editPaid' type='number' name='spl' id='${dataset[rcdIdx].recordId}-editPaid' min='0' max='100'><span class='output outPaid' id='${dataset[rcdIdx].recordId}-outPaid'>${dataset[rcdIdx].paid}</span>`;

        let rcdAbsRemCell = rcdRow.insertCell(5);
        rcdAbsRemCell.id = dataset[rcdIdx].recordId + '-rcdAbsRemCell';
        rcdAbsRemCell.headers = 'absoluteRemainingTbCol';
        let toPay = eqCon - dataset[rcdIdx].paid;
        rcdAbsRemCell.innerHTML = `<span class='output outAbsRem' id='${dataset[rcdIdx].recordId}-outAbsRem'>${toPay}</span>`;

        let rcdRelRemCell = rcdRow.insertCell(6);
        rcdRelRemCell.id = dataset[rcdIdx].recordId + '-rcdRelRemCell';
        rcdRelRemCell.headers = 'relativeRemainingTbCol';
        let toPayPer = Math.ceil(toPay*100/eqCon);
        rcdRelRemCell.innerHTML = `<span class='output outRelRem' id='${dataset[rcdIdx].recordId}-outRelRem'>${toPayPer}</span>`;

        //go to the following row
        rowCount = table.rows.length;
    }

    //Attach event listeners (buttons)
    const editBtn = document.querySelector('#editBtn');
    const updateBtn = document.querySelector('#updateBtn');
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
}

/*
__getCheckedColRows function:
This function helps to determine
which rows and columns have been selected
by the user, storing that information for later
use in the editing process
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
        __selectedCells.checkedRowIds = checkedRows.map((v,i)=> {return (v.id).split('-')[0]});
        if(table){
            __selectedCells.rowCount = table.rows.length;
        }else{
            throw('table not found');
        }
        __selectedCells.editableCells = document.querySelectorAll("." + __selectedCells.checkedColId);
        return true;
    }
}

/*
editBtnFunc function:
This function is an event of "Edit" button
It roles is to show the input fields for the
cells the user has selected
*/
let editBtnFunc = function(){
    
    //populate __selectedCells using the __getCheckedColRows function
    let gotit:boolean=false;
    gotit = __getCheckedColRows();
    if(!gotit){
        return;
    }    

    //go through all editable cells; if marked as selected, display the Edit field
    let editables = __getEditables();
    for(let editIdx = 0; editIdx < editables.length; editIdx++){
        let editableID:string = (editables[editIdx].id).split('-')[0];

        if(__selectedCells.checkedRowIds.indexOf(editableID) != -1 && (editables[editIdx].id).split('-')[1] === __selectedCells.checkedColId){
            editables[editIdx].style.display = 'inline-block';
        }else{
            editables[editIdx].style.display = 'none';
        }
    }
}

/* newContrAndSumSpltFunc function:

this function updates the following global variables:
---  __updatedContribs object with the new values of the edited / non-edited cells by row (id);
--- count the number of non-edited participants (__numberOfSplits)
--- and after getting all the data calculates the __sumNewSplit value
*/

let __newContrAndSumSpltFunc = function(selOutput:NodeListOf<Element>){

    // get data from edited cells and keep it in __updatedContribs
    for(let editedIdx = 0; editedIdx <  __selectedCells.editableCells.length; editedIdx++){
        let key = (__selectedCells.editableCells[editedIdx].id).split('-')[0];

        //just check if there is a value to see if edited
        if(__selectedCells.editableCells[editedIdx].value != ''){
            __updatedContribs[key].newContr = [Number(__selectedCells.editableCells[editedIdx].value)];
            __updatedContribs[key].edited = true;
        }else{
            __updatedContribs[key].newContr = [Number(selOutput[editedIdx].innerHTML)];
            __updatedContribs[key].edited = false;
            //count this one another participant that will receive an new split
            __numberOfSplits += 1;
        }
    }

    //get current contr value and make a first calculation of the differences for the selected participants
    //keep the value as 0 for the not selected ones
    for(let outputIdx = 0; outputIdx <  selOutput.length; outputIdx++){
        let key = (selOutput[outputIdx].id).split('-')[0];
        __updatedContribs[key].newContr.push(Number(selOutput[outputIdx].innerHTML));
        if(__selectedCells.checkedRowIds.indexOf(key) != -1){
            __updatedContribs[key].newContr.push(__updatedContribs[key].newContr[1]-__updatedContribs[key].newContr[0]);
        }else{
            __updatedContribs[key].newContr.push(0);
        }
    }

    //__sumNewSplit functionality is IMPORTANT
    //the function collect and sum the remainings left by the edited participants
    //this remaining is the one that will be evenly splitted between the rest of the participants
    //which are summed in __numberOfSplits counter 
    __sumNewSplit = Object.keys(__updatedContribs).map((k,i)=>{if(__updatedContribs[k].edited){return __updatedContribs[k].newContr[2]}}).filter((v,i)=>{return v != undefined}).reduce((acc, b)=>{return acc+b});
}

/*
updateBtnFunc function:
This function is an event of "Update" button
It roles is to collect the inputs by the user
recalculate the values and update the whole
table accordingly before resetting all the 
temporary data collectors
*/
let updateBtnFunc = function(){

    //is the AbsSpl col edited?
    if(__selectedCells.checkedColId == 'editAbsSpl'){
        
        //get output of AbsSplt
        let __outsAbsSpl = __getOutputs('.outAbsSpl');
        
        //update __updatedContrbs obj, __numberOfSplits and __sumNewSplit
        __newContrAndSumSpltFunc(__outsAbsSpl);
        
        
        //it is time to update the outputs; we collect the corresponding columns
        //We will iterate through one of them and use the same indexing to update
        //the other ones
        let __outsRelSpl = __getOutputs('.outRelSpl');
        let __outsPaid = __getOutputs('.outPaid');
        let __outsAbsRem = __getOutputs('.outAbsRem');
        let __outsRelRem = __getOutputs('.outRelRem');
        for(let key in __updatedContribs){
            for(let outputIdx = 0; outputIdx < __outsAbsSpl.length; outputIdx++) {
                if((__outsAbsSpl[outputIdx].id).indexOf(key) != -1){
                    if(__updatedContribs[key].edited){
                        __outsAbsSpl[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[0]));
                        __outsRelSpl[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[0]*100/cTot));
                        __outsAbsRem[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[0] - Number(__outsPaid[outputIdx].innerHTML)));
                        __outsRelRem[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[key].newContr[0] - Number(__outsPaid[outputIdx].innerHTML))*100/__updatedContribs[key].newContr[0]));
                    }else{
                        //notice how the even split is made for the non-selected participants
                        __outsAbsSpl[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[1] + __sumNewSplit/__numberOfSplits));
                        __outsRelSpl[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[key].newContr[1] + __sumNewSplit/__numberOfSplits)*100/cTot));
                        __outsAbsRem[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[1] + __sumNewSplit/__numberOfSplits - Number(__outsPaid[outputIdx].innerHTML)));
                        __outsRelRem[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[key].newContr[1] + __sumNewSplit/__numberOfSplits - Number(__outsPaid[outputIdx].innerHTML))*100/(__updatedContribs[key].newContr[1] + __sumNewSplit/__numberOfSplits)));
                    }
                }
            }             
        }

    //is the RelSpl col edited?
    //NOTICE that comments are very similar as for editAbsSpl, with a small difference at the moment of updating the values of the table...
    }else if(__selectedCells.checkedColId == 'editRelSpl'){

        //get output of RelSplt
        let __outsRelSpl = __getOutputs('.outRelSpl');

        //update __updatedContrbs obj, __numberOfSplits and __sumNewSplit
        __newContrAndSumSpltFunc(__outsRelSpl);

        //it is time to update the outputs; we collect the corresponding columns
        //We will iterate through one of them and use the same indexing to update
        //the other ones
        let __outsAbsSpl = __getOutputs('.outAbsSpl');
        let __outsPaid = __getOutputs('.outPaid');
        let __outsAbsRem = __getOutputs('.outAbsRem');
        let __outsRelRem = __getOutputs('.outRelRem');
        for(let key in __updatedContribs){
            for(let outputIdx = 0; outputIdx < __outsRelSpl.length; outputIdx++) {
                if((__outsRelSpl[outputIdx].id).indexOf(key) != -1){
                    if(__updatedContribs[key].edited){
                        __outsRelSpl[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[0]));
                        //NOTICE there is a conversion of relative values to absolute to reuse previous code
                        __updatedContribs[key].newContr = __updatedContribs[key].newContr.map((v:number,i:number)=>{return Math.ceil(v/100*cTot)});
                        __outsAbsSpl[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[0]));
                        __outsAbsRem[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[0] - Number(__outsPaid[outputIdx].innerHTML)));
                        __outsRelRem[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[key].newContr[0] - Number(__outsPaid[outputIdx].innerHTML))*100/__updatedContribs[key].newContr[0]));
                    }else{
                        __outsRelSpl[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[key].newContr[1] + __sumNewSplit/__numberOfSplits)));
                        //NOTICE there is a conversion of relative values to absolute to reuse previous code
                        __updatedContribs[key].newContr = __updatedContribs[key].newContr.map((v:number,i:number)=>{return Math.ceil(v/100*cTot)});
                        let redoNewSplit = Math.ceil(__sumNewSplit*cTot/100);
                        __outsAbsSpl[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[1] + redoNewSplit/__numberOfSplits));
                        __outsAbsRem[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[1] + redoNewSplit/__numberOfSplits - Number(__outsPaid[outputIdx].innerHTML)));
                        __outsRelRem[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[key].newContr[1] + redoNewSplit/__numberOfSplits - Number(__outsPaid[outputIdx].innerHTML))*100/(__updatedContribs[key].newContr[1] + redoNewSplit/__numberOfSplits)));
                    }
                }
            }             
        }
    }else if(__selectedCells.checkedColId == 'editPaid'){
        
        // get data from edited and NOT edited cells and keep it in __updatedContribs
        let __outsPaid = __getOutputs('.outPaid');
        let __outsAbsSpl = __getOutputs('.outAbsSpl');
        let __outsAbsRem = __getOutputs('.outAbsRem');
        let __outsRelRem = __getOutputs('.outRelRem');

        for(let editedIdx = 0; editedIdx <  __selectedCells.editableCells.length; editedIdx++){

            //just check if there is a value to see if edited
            //if edited, calculate the corresponding differences
            //do nothing is not edited
            if(__selectedCells.editableCells[editedIdx].value != ''){
                __outsPaid[editedIdx].innerHTML = String(Math.ceil(__selectedCells.editableCells[editedIdx].value));
                __outsAbsRem[editedIdx].innerHTML = String(Math.ceil(Number(__outsAbsSpl[editedIdx].innerHTML) - parseInt(__selectedCells.editableCells[editedIdx].value)));
                __outsRelRem[editedIdx].innerHTML = String(Math.ceil((Number(__outsAbsSpl[editedIdx].innerHTML) - parseInt(__selectedCells.editableCells[editedIdx].value))*100/Number(__outsAbsSpl[editedIdx].innerHTML)));
            }
        }
    }

    //reset all global variables to initial
    __selectedCells = {
        checkedColId: null,
        checkedRowIds: [],
        rowCount: -1,
        editableCells: []
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
    __getEditables().forEach((v,i)=>{v.style.display = 'none'; v.value = '';});


}

window.onload = function(){
    populateFunc();
}