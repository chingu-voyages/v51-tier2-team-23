//TODO: change all the project so it is based on dataset attribute instead of ids or values? What happens if one of the participant leaves the group?
//https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
//https://stackoverflow.com/questions/11563638/how-do-i-get-the-value-of-text-input-field-using-javascript
//https://github.com/chingu-voyages/v51-tier2-team-23/tree/development
//https://splittersub.vercel.app/groups/1728599891814

/* DATASET */
var dataset = [
    {
        name: 'Quien',
        recordId: 'quien',
        paid: 0,
        absolContr: null
    },
    {
        name: 'Como',
        recordId: 'como',
        paid: 1000,
        absolContr: null
    },
    {
        name: 'Donde',
        recordId: 'donde',
        paid: 0,
        absolContr: null
    },
    {
        name: 'Cuando',
        recordId: 'cuando',
        paid: 0,
        absolContr: null
    },
];
/* DATA COLLECTORS and CONSTANTS */
var outputs = {};
var __selectedCells = {
    checkedColId: null,
    checkedRowIds: [],
    rowCount: -1,
    editableCells: []
};
var __updatedContribs = {};
var __recordIds = dataset.map(function (v, i) { return v.recordId; });
var cTotsel = document.getElementById("tot");
var cTot;
if (cTotsel) {
    cTot = Number(cTotsel.innerHTML);
}
else {
    throw ('HtmlElement null');
}
var __numberOfSplits = 0;
/* CONSTANTS and GLOBAL-USE ELEMENTS */
var table = document.querySelector("table");
var __getEditables = function () { return document.querySelectorAll('.editable'); };
var __getOutputs = function (selector) { return document.querySelectorAll(selector); };
/* FUNCTIONALITIES */
var populateFunc = function () {
    var rowCount;
    if (table) {
        rowCount = table.rows.length;
    }
    else {
        throw ('table was not found');
    }
    var eqCon = cTot / 4;
    var eqPer = eqCon * 100 / cTot;
    for (var rcdIdx = 0; rcdIdx < dataset.length; rcdIdx++) {
        //insert a new row
        var rcdRow = table.insertRow(rowCount);
        rcdRow.id = dataset[rcdIdx].recordId;
        rcdRow.className = "body-row";
        //start populating updateContribs with the record ids as keys
        __updatedContribs[dataset[rcdIdx].recordId] = {};
        //prepare the correponding cells, specific to each column
        var rcdCBoxCell = rcdRow.insertCell(0);
        rcdCBoxCell.id = dataset[rcdIdx].recordId + '-checkboxCell';
        rcdCBoxCell.headers = 'checkboxesTbCol';
        rcdCBoxCell.innerHTML = "<input type='checkbox' id='".concat(dataset[rcdIdx].recordId, "-checkbox'></input>");
        var rcdNameCell = rcdRow.insertCell(1);
        rcdNameCell.id = dataset[rcdIdx].recordId + '-nameCell';
        rcdNameCell.headers = 'namesTbCol';
        rcdNameCell.innerHTML = dataset[rcdIdx].name;
        var rcdRelSplCell = rcdRow.insertCell(2);
        rcdRelSplCell.id = dataset[rcdIdx].recordId + '-relsplCell';
        rcdRelSplCell.headers = 'editRelSpl';
        rcdRelSplCell.innerHTML = "<input class='editable editRelSpl' type='number' name='spl' id='".concat(dataset[rcdIdx].recordId, "-editRelSpl' min='0' max='100'><span class='output outRelSpl' id='").concat(dataset[rcdIdx].recordId, "-outRelSpl'>").concat(eqPer, "</span>");
        var rcdAbsSplCell = rcdRow.insertCell(3);
        rcdAbsSplCell.id = dataset[rcdIdx].recordId + '-abssplCell';
        rcdAbsSplCell.headers = 'editAbsSpl';
        rcdAbsSplCell.innerHTML = "<input class='editable editAbsSpl' type='number' name='spl' id='".concat(dataset[rcdIdx].recordId, "-editAbsSpl' min='0' max='100'><span class='output outAbsSpl' id='").concat(dataset[rcdIdx].recordId, "-outAbsSpl'>").concat(eqCon, "</span>");
        var rcdPaidCell = rcdRow.insertCell(4);
        rcdPaidCell.id = dataset[rcdIdx].recordId + '-rcdPaidCell';
        rcdPaidCell.headers = 'editPaid';
        rcdPaidCell.innerHTML = "<input class='editable editPaid' type='number' name='spl' id='".concat(dataset[rcdIdx].recordId, "-editPaid' min='0' max='100'><span class='output outPaid' id='").concat(dataset[rcdIdx].recordId, "-outPaid'>").concat(dataset[rcdIdx].paid, "</span>");
        var rcdAbsRemCell = rcdRow.insertCell(5);
        rcdAbsRemCell.id = dataset[rcdIdx].recordId + '-rcdAbsRemCell';
        rcdAbsRemCell.headers = 'absoluteRemainingTbCol';
        var toPay = eqCon - dataset[rcdIdx].paid;
        rcdAbsRemCell.innerHTML = "<span class='output outAbsRem' id='".concat(dataset[rcdIdx].recordId, "-outAbsRem'>").concat(toPay, "</span>");
        var rcdRelRemCell = rcdRow.insertCell(6);
        rcdRelRemCell.id = dataset[rcdIdx].recordId + '-rcdRelRemCell';
        rcdRelRemCell.headers = 'relativeRemainingTbCol';
        var toPayPer = Math.ceil(toPay * 100 / eqCon);
        rcdRelRemCell.innerHTML = "<span class='output outRelRem' id='".concat(dataset[rcdIdx].recordId, "-outRelRem'>").concat(toPayPer, "</span>");
        //go to the following row
        rowCount = table.rows.length;
    }
    var editBtn = document.querySelector('#editBtn');
    var updateBtn = document.querySelector('#updateBtn');
    if (editBtn) {
        editBtn.addEventListener('click', editBtnFunc);
    }
    else {
        throw ('editt button not found');
    }
    if (updateBtn) {
        updateBtn.addEventListener('click', updateBtnFunc);
    }
    else {
        throw ('update button not found');
    }
};
function __getCheckedColRows() {
    var radios = document.querySelectorAll('input[type="radio"]');
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var checkedCol = !radios ? [] : Array.from(radios).filter(function (r, i) { return r.checked; });
    var checkedRows = !checkboxes ? [] : Array.from(checkboxes).filter(function (cbox, i) { return cbox.checked; });
    //collect colid, rowids, length of the table and all editable cells
    if (checkedCol.length == 0 || checkedRows.length == 0) {
        console.log(checkedCol, checkedRows);
        return false;
    }
    else {
        __selectedCells.checkedColId = checkedCol[0].id;
        __selectedCells.checkedRowIds = checkedRows.map(function (v, i) { return (v.id).split('-')[0]; });
        if (table) {
            __selectedCells.rowCount = table.rows.length;
        }
        else {
            throw ('table not found');
        }
        __selectedCells.editableCells = document.querySelectorAll("." + __selectedCells.checkedColId);
        return true;
    }
}
var editBtnFunc = function () {
    //populate __selectedCells
    var gotit = false;
    gotit = __getCheckedColRows();
    if (!gotit) {
        return;
    }
    //go through all editable cells; if marked as selected, display the Edit field
    var editables = __getEditables();
    for (var editIdx = 0; editIdx < editables.length; editIdx++) {
        var editableID = (editables[editIdx].id).split('-')[0];
        if (__selectedCells.checkedRowIds.indexOf(editableID) != -1 && (editables[editIdx].id).split('-')[1] === __selectedCells.checkedColId) {
            editables[editIdx].style.display = 'inline-block';
        }
        else {
            editables[editIdx].style.display = 'none';
        }
    }
};
var updateBtnFunc = function () {
    //is the AbsSpl col edited?
    if (__selectedCells.checkedColId == 'editAbsSpl') {
        var __outsAbsSpl = __getOutputs('.outAbsSpl');
        // get data from edited cells and keep it in __updatedContribs
        for (var editedIdx = 0; editedIdx < __selectedCells.editableCells.length; editedIdx++) {
            var key = (__selectedCells.editableCells[editedIdx].id).split('-')[0];
            //just check if there is a value to see if edited
            if (__selectedCells.editableCells[editedIdx].value != '') {
                __updatedContribs[key].newContr = [Number(__selectedCells.editableCells[editedIdx].value)];
                __updatedContribs[key].edited = true;
                //__updatedContribs[key].newRelContr = 100*__updatedContribs[key].newContr/cTot;
            }
            else {
                __updatedContribs[key].newContr = [Number(__outsAbsSpl[editedIdx].innerHTML)];
                __updatedContribs[key].edited = false;
                //__updatedContribs[key].newRelContr = null;
                __numberOfSplits += 1;
            }
        }
        //get current contr value and make a first collection of differences
        for (var outputIdx = 0; outputIdx < __outsAbsSpl.length; outputIdx++) {
            var key = (__outsAbsSpl[outputIdx].id).split('-')[0];
            __updatedContribs[key].newContr.push(Number(__outsAbsSpl[outputIdx].innerHTML));
            if (__selectedCells.checkedRowIds.indexOf(key) != -1) {
                __updatedContribs[key].newContr.push(__updatedContribs[key].newContr[1] - __updatedContribs[key].newContr[0]);
            }
            else {
                __updatedContribs[key].newContr.push(0);
            }
        }
        //console.log(__updatedContribs);
        var sumNewSplit = Object.keys(__updatedContribs).map(function (k, i) { if (__updatedContribs[k].edited) {
            return __updatedContribs[k].newContr[2];
        } }).filter(function (v, i) { return v != undefined; }).reduce(function (acc, b) { return acc + b; });
        var __outsRelSpl = __getOutputs('.outRelSpl');
        var __outsPaid = __getOutputs('.outPaid');
        var __outsAbsRem = __getOutputs('.outAbsRem');
        var __outsRelRem = __getOutputs('.outRelRem');
        for (var key in __updatedContribs) {
            //console.log(key, __updatedContribs[key])
            for (var outputIdx = 0; outputIdx < __outsAbsSpl.length; outputIdx++) {
                if ((__outsAbsSpl[outputIdx].id).indexOf(key) != -1) {
                    if (__updatedContribs[key].edited) {
                        __outsAbsSpl[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[0]));
                        __outsRelSpl[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[0] * 100 / cTot));
                        __outsAbsRem[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[0] - Number(__outsPaid[outputIdx].innerHTML)));
                        __outsRelRem[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[key].newContr[0] - Number(__outsPaid[outputIdx].innerHTML)) * 100 / __updatedContribs[key].newContr[0]));
                    }
                    else {
                        __outsAbsSpl[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[1] + sumNewSplit / __numberOfSplits));
                        __outsRelSpl[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[key].newContr[1] + sumNewSplit / __numberOfSplits) * 100 / cTot));
                        __outsAbsRem[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[1] + sumNewSplit / __numberOfSplits - Number(__outsPaid[outputIdx].innerHTML)));
                        __outsRelRem[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[key].newContr[1] + sumNewSplit / __numberOfSplits - Number(__outsPaid[outputIdx].innerHTML)) * 100 / (__updatedContribs[key].newContr[1] + sumNewSplit / __numberOfSplits)));
                    }
                }
            }
        }
    }
    else if (__selectedCells.checkedColId == 'editRelSpl') {
        var __outsRelSpl = __getOutputs('.outRelSpl');
        // get data from edited cells and keep it in __updatedContribs
        for (var editedIdx = 0; editedIdx < __selectedCells.editableCells.length; editedIdx++) {
            var key = (__selectedCells.editableCells[editedIdx].id).split('-')[0];
            //just check if there is a value to see if edited
            if (__selectedCells.editableCells[editedIdx].value != '') {
                __updatedContribs[key].newContr = [Number(__selectedCells.editableCells[editedIdx].value)];
                __updatedContribs[key].edited = true;
            }
            else {
                __updatedContribs[key].newContr = [Number(__outsRelSpl[editedIdx].innerHTML)];
                __updatedContribs[key].edited = false;
                __numberOfSplits += 1;
            }
        }
        //get current contr value and make a first collection of differences
        for (var outputIdx = 0; outputIdx < __outsRelSpl.length; outputIdx++) {
            var key = (__outsRelSpl[outputIdx].id).split('-')[0];
            __updatedContribs[key].newContr.push(Number(__outsRelSpl[outputIdx].innerHTML));
            if (__selectedCells.checkedRowIds.indexOf(key) != -1) {
                __updatedContribs[key].newContr.push(__updatedContribs[key].newContr[1] - __updatedContribs[key].newContr[0]);
            }
            else {
                __updatedContribs[key].newContr.push(0);
            }
        }
        console.log(__updatedContribs);
        var sumNewSplit = Object.keys(__updatedContribs).map(function (k, i) { if (__updatedContribs[k].edited) {
            return __updatedContribs[k].newContr[2];
        } }).filter(function (v, i) { return v != undefined; }).reduce(function (acc, b) { return acc + b; });
        var __outsAbsSpl = __getOutputs('.outAbsSpl');
        var __outsPaid = __getOutputs('.outPaid');
        var __outsAbsRem = __getOutputs('.outAbsRem');
        var __outsRelRem = __getOutputs('.outRelRem');
        for (var key in __updatedContribs) {
            //console.log(key, __updatedContribs[key])
            for (var outputIdx = 0; outputIdx < __outsRelSpl.length; outputIdx++) {
                if ((__outsRelSpl[outputIdx].id).indexOf(key) != -1) {
                    if (__updatedContribs[key].edited) {
                        __outsRelSpl[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[0]));
                        __updatedContribs[key].newContr = __updatedContribs[key].newContr.map(function (v, i) { return Math.ceil(v / 100 * cTot); });
                        __outsAbsSpl[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[0]));
                        __outsAbsRem[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[0] - Number(__outsPaid[outputIdx].innerHTML)));
                        __outsRelRem[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[key].newContr[0] - Number(__outsPaid[outputIdx].innerHTML)) * 100 / __updatedContribs[key].newContr[0]));
                    }
                    else {
                        __outsRelSpl[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[key].newContr[1] + sumNewSplit / __numberOfSplits)));
                        __updatedContribs[key].newContr = __updatedContribs[key].newContr.map(function (v, i) { return Math.ceil(v / 100 * cTot); });
                        var redoNewSplit = Math.ceil(sumNewSplit * cTot / 100);
                        __outsAbsSpl[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[1] + redoNewSplit / __numberOfSplits));
                        __outsAbsRem[outputIdx].innerHTML = String(Math.ceil(__updatedContribs[key].newContr[1] + redoNewSplit / __numberOfSplits - Number(__outsPaid[outputIdx].innerHTML)));
                        __outsRelRem[outputIdx].innerHTML = String(Math.ceil((__updatedContribs[key].newContr[1] + redoNewSplit / __numberOfSplits - Number(__outsPaid[outputIdx].innerHTML)) * 100 / (__updatedContribs[key].newContr[1] + redoNewSplit / __numberOfSplits)));
                    }
                }
            }
        }
    }
    else if (__selectedCells.checkedColId == 'editPaid') {
        var __outsPaid = __getOutputs('.outPaid');
        // get data from edited cells and keep it in __updatedContribs
        var __outsAbsSpl = __getOutputs('.outAbsSpl');
        var __outsAbsRem = __getOutputs('.outAbsRem');
        var __outsRelRem = __getOutputs('.outRelRem');
        for (var editedIdx = 0; editedIdx < __selectedCells.editableCells.length; editedIdx++) {
            var key = (__selectedCells.editableCells[editedIdx].id).split('-')[0];
            //just check if there is a value to see if edited
            if (__selectedCells.editableCells[editedIdx].value != '') {
                __outsPaid[editedIdx].innerHTML = String(Math.ceil(__selectedCells.editableCells[editedIdx].value));
                __outsAbsRem[editedIdx].innerHTML = String(Math.ceil(Number(__outsAbsSpl[editedIdx].innerHTML) - parseInt(__selectedCells.editableCells[editedIdx].value)));
                __outsRelRem[editedIdx].innerHTML = String(Math.ceil((Number(__outsAbsSpl[editedIdx].innerHTML) - parseInt(__selectedCells.editableCells[editedIdx].value)) * 100 / Number(__outsAbsSpl[editedIdx].innerHTML)));
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
    };
    __updatedContribs = {};
    for (var rcdIdIdx = 0; rcdIdIdx < __recordIds.length; rcdIdIdx++) {
        __updatedContribs[__recordIds[rcdIdIdx]] = {};
    }
    __numberOfSplits = 0;
    //reset all checked boxes and radios to unchecked
    document.querySelectorAll('input[type="radio"]');
    var radios = document.querySelectorAll('input[type="radio"]');
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    radios.forEach(function (v, i) { if (v.checked) {
        v.checked = false;
    } });
    checkboxes.forEach(function (v, i) { if (v.checked) {
        v.checked = false;
    } });
    __getEditables().forEach(function (v, i) { v.style.display = 'none'; v.value = ''; });
};
window.onload = function () {
    populateFunc();
};
