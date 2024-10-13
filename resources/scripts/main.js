
//TODO: change all the project so it is based on dataset attribute instead of ids or values? What happens if one of the participant leaves the group?
//https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
//https://stackoverflow.com/questions/11563638/how-do-i-get-the-value-of-text-input-field-using-javascript

/* DATASET */

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

/* DATA COLLECTORS and CONSTANTS */

let outputs = {};

let __selectedCells = {
    checkedColId: null,
    checkedRowIds: [],
    rowCount: -1,
    editableCells: []
}

let __updatedContribs = {} 

let __recordIds = dataset.map((v,i)=>{return v.recordId;});

const cTot = Number(document.getElementById("tot").innerHTML);

let __numberOfSplits = 0;

/* CONSTANTS and GLOBAL-USE ELEMENTS */

let table = document.querySelector("table");

let __getEditables = function(){return document.querySelectorAll('.editable')}

let __getOutputs = function(selector){return document.querySelectorAll(selector)};

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
        
        __updatedContribs[ dataset[rcdIdx].recordId] = {};

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
        rcdPaidCell.innerHTML = `<input class='editable editPaid' type='number' name='spl' id='${dataset[rcdIdx].recordId}-editPaid' min='0' max='100'><span class='output outPaid' id='${dataset[rcdIdx].recordId}-outPaid'>${dataset[rcdIdx].paid}</span>`;

        let rcdAbsRemCell = rcdRow.insertCell(5);
        rcdAbsRemCell.id = dataset[rcdIdx].recordId + '-rcdAbsRemCell';
        rcdAbsRemCell.headers = 'absoluteRemainingTbCol';
        let toPay = eqCon - dataset[rcdIdx].paid;
        rcdAbsRemCell.innerHTML = `<span class='output outAbsRem' id='${dataset[rcdIdx].recordId}-outAbsRem'>${toPay}</span>`;

        let rcdRelRemCell = rcdRow.insertCell(6);
        rcdRelRemCell.id = dataset[rcdIdx].recordId + '-rcdRelRemCell';
        rcdRelRemCell.headers = 'relativeRemainingTbCol';
        let toPayPer = parseInt(toPay*100/eqCon)
        rcdRelRemCell.innerHTML = `<span class='output outRelRem' id='${dataset[rcdIdx].recordId}-outRelRem'>${toPayPer}</span>`;

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

    __selectedCells.checkedColId = checkedCol[0].id;
    __selectedCells.checkedRowIds = checkedRows.map((v,i)=> {return (v.id).split('-')[0]});
    __selectedCells.rowCount = table.rows.length;
    __selectedCells.editableCells = document.querySelectorAll("." + __selectedCells.checkedColId);
}

let editBtnFunc = function(){
    
    //populate __selectedCells
    
    __getCheckedColRows();

    //go through all editable cells; if marked as selected, display the Edit field
    let editables = __getEditables();

    for(let editIdx = 0; editIdx < editables.length; editIdx++){
        if(__selectedCells.checkedRowIds.includes((editables[editIdx].id).split('-')[0]) && (editables[editIdx].id).split('-')[1] === __selectedCells.checkedColId){
            editables[editIdx].style.display = 'inline-block';
        }else{
            editables[editIdx].style.display = 'none';
        }
    }
}

let updateBtnFunc = function(){

    
        /* TODO
    [x]- push also outputs to __updatedContribs[key].newContr (line 218)
    [x]- if edited, push the difference with current output, otherwise 0

    [x]- sum new split (line 232)

    [x]- go through output again, to update the new values, where the new split is added to the non-edited (from line 236)
    []- recalcuate the percentage

    [x]- update percentages and differences with paid values

        THEN
    []- do the opposite algorithm for updates on the percentage column

        THEN
    []- do a simpler algorithm for the paid column
        */

    //is the AbsSpl col edited?
    
    if(__selectedCells.checkedColId == 'editAbsSpl'){
        
        let __outsAbsSpl = __getOutputs('.outAbsSpl');

        // get data from edited cells and keep it in __updatedContribs

        for(let editedIdx = 0; editedIdx <  __selectedCells.editableCells.length; editedIdx++){
            let key = (__selectedCells.editableCells[editedIdx].id).split('-')[0];

            //just check if there is a value to see if edited

            if(__selectedCells.editableCells[editedIdx].value != ''){
                __updatedContribs[key].newContr = [Number(__selectedCells.editableCells[editedIdx].value)];
                __updatedContribs[key].edited = true;
                //__updatedContribs[key].newRelContr = 100*__updatedContribs[key].newContr/cTot;
            }else{
                __updatedContribs[key].newContr = [Number(__outsAbsSpl[editedIdx].innerHTML)];
                __updatedContribs[key].edited = false;
                //__updatedContribs[key].newRelContr = null;
                __numberOfSplits += 1;
            }
        }

        //get current contr value and make a first collection of differences


    
        for(let outputIdx = 0; outputIdx <  __outsAbsSpl.length; outputIdx++){
            let key = (__outsAbsSpl[outputIdx].id).split('-')[0];
            __updatedContribs[key].newContr.push(Number(__outsAbsSpl[outputIdx].innerHTML));
            if(__selectedCells.checkedRowIds.includes(key)){
                __updatedContribs[key].newContr.push(__updatedContribs[key].newContr[1]-__updatedContribs[key].newContr[0]);
            }else{
                __updatedContribs[key].newContr.push(0);
            }
        }

        //console.log(__updatedContribs);

        let sumNewSplit = Object.keys(__updatedContribs).map((k,i)=>{if(__updatedContribs[k].edited){return __updatedContribs[k].newContr[2]}}).filter((v,i)=>{return v != undefined}).reduce((acc, b)=>{return acc+b});
        let __outsRelSpl = __getOutputs('.outRelSpl');
        let __outsPaid = __getOutputs('.outPaid');
        let __outsAbsRem = __getOutputs('.outAbsRem');
        let __outsRelRem = __getOutputs('.outRelRem');
        for(let key in __updatedContribs){
            //console.log(key, __updatedContribs[key])
            for(let outputIdx = 0; outputIdx < __outsAbsSpl.length; outputIdx++) {
                if((__outsAbsSpl[outputIdx].id).includes(key)){
                    if(__updatedContribs[key].edited){
                        __outsAbsSpl[outputIdx].innerHTML = parseInt(__updatedContribs[key].newContr[0]);
                        __outsRelSpl[outputIdx].innerHTML = parseInt(__updatedContribs[key].newContr[0]*100/cTot);
                        __outsAbsRem[outputIdx].innerHTML = parseInt(__updatedContribs[key].newContr[0] - Number(__outsPaid[outputIdx].innerHTML));
                        __outsRelRem[outputIdx].innerHTML = parseInt((__updatedContribs[key].newContr[0] - Number(__outsPaid[outputIdx].innerHTML))*100/__updatedContribs[key].newContr[0]);
                    }else{
                        __outsAbsSpl[outputIdx].innerHTML = parseInt(__updatedContribs[key].newContr[1] + sumNewSplit/__numberOfSplits);
                        __outsRelSpl[outputIdx].innerHTML = parseInt((__updatedContribs[key].newContr[1] + sumNewSplit/__numberOfSplits)*100/cTot);
                        __outsAbsRem[outputIdx].innerHTML = parseInt(__updatedContribs[key].newContr[1] + sumNewSplit/__numberOfSplits - Number(__outsPaid[outputIdx].innerHTML));
                        __outsRelRem[outputIdx].innerHTML = parseInt((__updatedContribs[key].newContr[1] + sumNewSplit/__numberOfSplits - Number(__outsPaid[outputIdx].innerHTML))*100/(__updatedContribs[key].newContr[1] + sumNewSplit/__numberOfSplits));
                    }
                }
            }             
        }
    }else if(__selectedCells.checkedColId == 'editRelSpl'){
        
        let __outsRelSpl = __getOutputs('.outRelSpl');

        // get data from edited cells and keep it in __updatedContribs

        for(let editedIdx = 0; editedIdx <  __selectedCells.editableCells.length; editedIdx++){
            let key = (__selectedCells.editableCells[editedIdx].id).split('-')[0];

            //just check if there is a value to see if edited

            if(__selectedCells.editableCells[editedIdx].value != ''){
                __updatedContribs[key].newContr = [Number(__selectedCells.editableCells[editedIdx].value)];
                __updatedContribs[key].edited = true;
            }else{
                __updatedContribs[key].newContr = [Number(__outsRelSpl[editedIdx].innerHTML)];
                __updatedContribs[key].edited = false;
                __numberOfSplits += 1;
            }
        }

        //get current contr value and make a first collection of differences


    
        for(let outputIdx = 0; outputIdx <  __outsRelSpl.length; outputIdx++){
            let key = (__outsRelSpl[outputIdx].id).split('-')[0];
            __updatedContribs[key].newContr.push(Number(__outsRelSpl[outputIdx].innerHTML));
            if(__selectedCells.checkedRowIds.includes(key)){
                __updatedContribs[key].newContr.push(__updatedContribs[key].newContr[1]-__updatedContribs[key].newContr[0]);
            }else{
                __updatedContribs[key].newContr.push(0);
            }
        }

        console.log(__updatedContribs);

        let sumNewSplit = Object.keys(__updatedContribs).map((k,i)=>{if(__updatedContribs[k].edited){return __updatedContribs[k].newContr[2]}}).filter((v,i)=>{return v != undefined}).reduce((acc, b)=>{return acc+b});
        let __outsAbsSpl = __getOutputs('.outAbsSpl');
        let __outsPaid = __getOutputs('.outPaid');
        let __outsAbsRem = __getOutputs('.outAbsRem');
        let __outsRelRem = __getOutputs('.outRelRem');
        for(let key in __updatedContribs){
            //console.log(key, __updatedContribs[key])
            for(let outputIdx = 0; outputIdx < __outsRelSpl.length; outputIdx++) {
                if((__outsRelSpl[outputIdx].id).includes(key)){
                    if(__updatedContribs[key].edited){
                        __outsRelSpl[outputIdx].innerHTML = parseInt(__updatedContribs[key].newContr[0]);
                        __updatedContribs[key].newContr = __updatedContribs[key].newContr.map((v,i)=>{return parseInt(v/100*cTot)});
                        __outsAbsSpl[outputIdx].innerHTML = parseInt(__updatedContribs[key].newContr[0]);
                        __outsAbsRem[outputIdx].innerHTML = parseInt(__updatedContribs[key].newContr[0] - Number(__outsPaid[outputIdx].innerHTML));
                        __outsRelRem[outputIdx].innerHTML = parseInt((__updatedContribs[key].newContr[0] - Number(__outsPaid[outputIdx].innerHTML))*100/__updatedContribs[key].newContr[0]);
                    }else{
                        __outsRelSpl[outputIdx].innerHTML = parseInt((__updatedContribs[key].newContr[1] + sumNewSplit/__numberOfSplits));
                        __updatedContribs[key].newContr = __updatedContribs[key].newContr.map((v,i)=>{return parseInt(v/100*cTot)});
                        let redoNewSplit = parseInt(sumNewSplit*cTot/100);
                        __outsAbsSpl[outputIdx].innerHTML = parseInt(__updatedContribs[key].newContr[1] + redoNewSplit/__numberOfSplits);
                        __outsAbsRem[outputIdx].innerHTML = parseInt(__updatedContribs[key].newContr[1] + redoNewSplit/__numberOfSplits - Number(__outsPaid[outputIdx].innerHTML));
                        __outsRelRem[outputIdx].innerHTML = parseInt((__updatedContribs[key].newContr[1] + redoNewSplit/__numberOfSplits - Number(__outsPaid[outputIdx].innerHTML))*100/(__updatedContribs[key].newContr[1] + redoNewSplit/__numberOfSplits));
                    }
                }
            }             
        }
    }else if(__selectedCells.checkedColId == 'editPaid'){
        
        let __outsPaid = __getOutputs('.outPaid');

        // get data from edited cells and keep it in __updatedContribs

        let __outsAbsSpl = __getOutputs('.outAbsSpl');
        let __outsAbsRem = __getOutputs('.outAbsRem');
        let __outsRelRem = __getOutputs('.outRelRem');

        for(let editedIdx = 0; editedIdx <  __selectedCells.editableCells.length; editedIdx++){
            let key = (__selectedCells.editableCells[editedIdx].id).split('-')[0];

            //just check if there is a value to see if edited

            if(__selectedCells.editableCells[editedIdx].value != ''){
                __outsPaid[editedIdx].innerHTML = parseInt(__selectedCells.editableCells[editedIdx].value);
                __outsAbsRem[editedIdx].innerHTML = parseInt(Number(__outsAbsSpl[editedIdx].innerHTML) - parseInt(__selectedCells.editableCells[editedIdx].value));
                __outsRelRem[editedIdx].innerHTML = parseInt((Number(__outsAbsSpl[editedIdx].innerHTML) - parseInt(__selectedCells.editableCells[editedIdx].value))*100/Number(__outsAbsSpl[editedIdx].innerHTML));
            }
        }
    }

    //set all global variables to initial
    
    outputs = {};

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

    //reset all checked boxes and radios to unchecked

    document.querySelectorAll('input[type="radio"]').forEach((v,i)=>{if(v.checked){v.checked = false}});
    document.querySelectorAll('input[type="checkbox"]').forEach((v,i)=>{if(v.checked){v.checked = false}});
    __getEditables().forEach((v,i)=>{v.style.display = 'none'; v.value = '';});


}

//}

window.onload = function(){
    populateFunc();

    const editBtn = document.querySelector('#editBtn');
    editBtn.addEventListener('click', editBtnFunc);

    const updateBtn = document.querySelector('#updateBtn');
    updateBtn.addEventListener('click', updateBtnFunc);
}