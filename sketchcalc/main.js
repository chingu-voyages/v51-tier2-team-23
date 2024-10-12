
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

let selectedCells = {
    col: null,
    rows: [],
    htmlElems: []
}

let updatedContribs = {} 

let recordIds = dataset.map((v,i)=>{return v.recordId;});

const cTot = Number(document.getElementById("tot").innerHTML);

let numberOfSplits = 0;


/* FUNCTIONALITIES */

let init = function(){ //create table
    let table = document.querySelector("table");
    let rowCount = table.rows.length;

    let eqCon = cTot/4;
    let eqPer = eqCon*100/cTot;

    for(let rcdIdx = 0; rcdIdx < dataset.length; rcdIdx++){
        let rcdRow = table.insertRow(rowCount);
        rcdRow.id =  dataset[rcdIdx].recordId;

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
        rcdRelSplCell.headers = 'relativeSplitTbCol';
        rcdRelSplCell.innerHTML = `<input class='edit' type='number' name='spl' id='${dataset[rcdIdx].recordId}-editRelSpl' min='0' max='100'><span class='output' id='${dataset[rcdIdx].recordId}-outRelSpl'>${eqPer}</span>`;

        let rcdAbsSplCell = rcdRow.insertCell(3);
        rcdAbsSplCell.id = dataset[rcdIdx].recordId + '-abssplCell';
        rcdAbsSplCell.headers = 'absoluteSplitTbCol';
        rcdAbsSplCell.innerHTML = `<input class='edit' type='number' name='spl' id='${dataset[rcdIdx].recordId}-editAbsSpl' min='0' max='100'><span class='output' id='${dataset[rcdIdx].recordId}-outAbsSpl'>${eqCon}</span>`;

        let rcdPaidCell = rcdRow.insertCell(4);
        rcdPaidCell.id = dataset[rcdIdx].recordId + '-checkboxCell';
        rcdPaidCell.headers = 'paidTbCol';
        rcdPaidCell.innerHTML = `<input class='edit' type='number' name='spl' id='${dataset[rcdIdx].recordId}-editPaid' min='0' max='100'><span class='output' id='${dataset[rcdIdx].recordId}-outPaid'>0.00</span>`;

        let rcdAbsRemCell = rcdRow.insertCell(5);
        rcdAbsRemCell.id = dataset[rcdIdx].recordId + '-checkboxCell';
        rcdAbsRemCell.headers = 'absoluteRemainingTbCol';
        rcdAbsRemCell.innerHTML = `<span class='output' id='${dataset[rcdIdx].recordId}-outAbsRem'>${eqCon}</span>`;

        let rcdRelRemCell = rcdRow.insertCell(6);
        rcdRelRemCell.id = dataset[rcdIdx].recordId + '-checkboxCell';
        rcdRelRemCell.headers = 'relativeRemainingTbCol';
        rcdRelRemCell.innerHTML = `<span class='output' id='${dataset[rcdIdx].recordId}-outRelRem'>${eqPer}</span>`;

        rowCount = table.rows.length;
    }
}

function __getCheckedColRows(){
    const radios = document.querySelectorAll('input[type="radio"]');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedCol = !radios? [] : Array.from(radios).filter((r,i)=>{return r.checked;});
    const checkedRows = !checkboxes? [] : Array.from(checkboxes).filter((cbox,i)=>{return cbox.checked;});
    return checkedCol, checkedRows;
}

let editBtn = function(){
    let inputAll = document.getElementsByTagName("input");
    let {checkedCol, checkedRows} = __getCheckedColRows();
    //console.log(checkedboxs, checkedradio);

    let rowscols = checkedboxs.map((v,i)=>{ if(v){
                return v+checkedradio[0];
            }});
    //console.log(rowscols);

    for(let i = 0; i < inputAll.length; i++){

        //update all inputs to close
        if(!(inputAll[i].value).includes('row') && !(inputAll[i].value).includes('col') && !(inputAll[i].value).includes('form')){
            inputAll[i].style.display = 'none';
        }                
        
        //open only those required
        if(checkedboxs.length > 0 && checkedradio.length > 0){
            for(let j = 0; j < rowscols.length; j++){
                if((inputAll[i].id).includes(rowscols[j] + 'in')){
                    inputAll[i].style.display = 'inline-block';
                }
            }
        }
    }
}

window.onload = function(){
    init();
}