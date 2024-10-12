
//TODO: change all the project so it is based on dataset attribute instead of ids or values? What happens if one of the participant leaves the group?
//https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
//https://stackoverflow.com/questions/11563638/how-do-i-get-the-value-of-text-input-field-using-javascript

/* DATASET */

let dataset = [
{
    name: 'Quien',
    recordId: 'quien',
    absolContr: null
},
{
    name: 'Como',
    recordId: 'como',
    absolContr: null
},
{
    name: 'Donde',
    recordId: 'donde',
    absolContr: null
},
{
    name: 'Cuando',
    recordId: 'cuando',
    absolContr: null
},
];

/* DATA COLLECTORS and CONSTANTS */

let outputs = {};

let selectedCells = {
    checkedColId: null,
    checkedRowIds: [],
    rowCount: -1,
    editableCells: []
}

let updatedContribs = {} 

let recordIds = dataset.map((v,i)=>{return v.recordId;});

const cTot = Number(document.getElementById("tot").innerHTML);

let numberOfSplits = 0;

/* CONSTANTS and GLOBAL-USE ELEMENTS */

const table = document.querySelector("table");

let getOutputs = function(selector){return document.querySelectorAll(selector)};

/* FUNCTIONALITIES */

let populateFunc = function(){ //create table

    let rowCount = table.rows.length;
    let eqCon = cTot/4;
    let eqPer = eqCon*100/cTot;

    for(let rcdIdx = 0; rcdIdx < dataset.length; rcdIdx++){
        
        //insert a new row

        let rcdRow = table.insertRow(rowCount);
        rcdRow.id =  dataset[rcdIdx].recordId;

        //start populating updateContribs with the record ids as keys
        
        updatedContribs[ dataset[rcdIdx].recordId] = {};

        //prepare the correponding cells, specific to each column
        
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
        rcdPaidCell.innerHTML = `<input class='editable editPaid' type='number' name='spl' id='${dataset[rcdIdx].recordId}-editPaid' min='0' max='100'><span class='output outPaid' id='${dataset[rcdIdx].recordId}-outPaid'>0.00</span>`;

        let rcdAbsRemCell = rcdRow.insertCell(5);
        rcdAbsRemCell.id = dataset[rcdIdx].recordId + '-rcdAbsRemCell';
        rcdAbsRemCell.headers = 'absoluteRemainingTbCol';
        rcdAbsRemCell.innerHTML = `<span class='output outAbsRem' id='${dataset[rcdIdx].recordId}-outAbsRem'>${eqCon}</span>`;

        let rcdRelRemCell = rcdRow.insertCell(6);
        rcdRelRemCell.id = dataset[rcdIdx].recordId + '-rcdRelRemCell';
        rcdRelRemCell.headers = 'relativeRemainingTbCol';
        rcdRelRemCell.innerHTML = `<span class='output outRelRem' id='${dataset[rcdIdx].recordId}-outRelRem'>${eqPer}</span>`;

        //go to the following row

        rowCount = table.rows.length;
    }

    ////get all initial outputs
    
    //outputs.outRelSplFunc = document.querySelectorAll('.outRelSpl');
    //outputs.outAbsSplFunc = document.querySelectorAll('.outAbsSpl');
    //outputs.outPaidFunc = document.querySelectorAll('.outPaid');
    //outputs.outRelRemFunc = document.querySelectorAll('.outRelRem');
    //outputs.outAbsRemFunc = document.querySelectorAll('.outAbsRem');
}

function __getCheckedColRows(){
    const radios = document.querySelectorAll('input[type="radio"]');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedCol = !radios? [] : Array.from(radios).filter((r,i)=>{return r.checked;});
    const checkedRows = !checkboxes? [] : Array.from(checkboxes).filter((cbox,i)=>{return cbox.checked;});

    //collect colid, rowids, length of the table and all editable cells

    selectedCells.checkedColId = checkedCol[0].id;
    selectedCells.checkedRowIds = checkedRows.map((v,i)=> {return (v.id).split('-')[0]});
    selectedCells.rowCount = table.rows.length;
    selectedCells.editableCells = document.querySelectorAll("." + selectedCells.checkedColId);
}

let editBtnFunc = function(){
    
    //populate selectedCells
    
    __getCheckedColRows();

    //go through all editable cells; if marked as selected, display the Edit field

    for(let editIdx = 0; editIdx < selectedCells.editableCells.length; editIdx++){
        if(selectedCells.checkedRowIds.includes((selectedCells.editableCells[editIdx].id).split('-')[0])){
            selectedCells.editableCells[editIdx].style.display = 'inline-block';
        }else{
            selectedCells.editableCells[editIdx].style.display = 'none';
        }
    }
}

let updateBtnFunc = function(){
    
    //is the AbsSpl col edited?
    
    if(selectedCells.checkedColId == 'editAbsSpl'){
        
        // get data from edited cells and keep it in updatedContribs

        for(let editedIdx = 0; editedIdx <  selectedCells.editableCells.length; editedIdx++){
            let key = (selectedCells.editableCells[editedIdx].id).split('-')[0];
            newContrs[key].newAbsContr = [Number(selectedCells.editableCells[editedIdx].value)];

            //just check if there is a value to see if edited

            if(selectedCells.editableCells[editedIdx].value){
                newContrs[key].edited = true;
                newContrs[key].newRelContr = 100*newContrs[key].newAbsContr/cTot;
            }else{
                newContrs[key].edited = false;
                newContrs[key].newRelContr = null;
                numberOfSplits += 1;
            }
        }
    }

    //get current contr value and make a first collection of differences

    let outputs = getOutputs('.outAbsSpl');

    /* TODO
        - push also outputs to newContrs[key].newAbsContr (line 218)
        - if edited, push the difference with current output, otherwise 0

        - sum new split (line 232)

        - go through output again, to update the new values, where the new split is added to the non-edited (from line 236)
        - recalcuate the percentage

        - update percentages and differences with paid values

    THEN
        - do the opposite algorithm for updates on the percentage column

    THEN
        - do a simpler algorithm for the paid column
    */
    for(let outputIdx = 0; outputIdx <  outputs.length; outputIdx++){

    }


}

window.onload = function(){
    populateFunc();
    const editBtn = document.querySelector('#editBtn');
    editBtn.addEventListener('click', editBtnFunc);
}