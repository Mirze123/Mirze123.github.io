const btnAdd = document.getElementById('btnNew');
const txtTitle = document.getElementById('txtTitle');
const txtBody = document.getElementById('txtBody');
const divTask = document.getElementById('divTask');
const itemArea = document.querySelector('.item-area');
const btnAddTask = document.getElementById('btnAddTask');
const txtSearch = document.getElementById('txtSearch');
var data = [];
var mode = false;
var id;

window.onload = function () {
    addEventListeners();
}

var addEventListeners = function () {
    btnAdd.addEventListener('click', function (event) {
        mode = false;
    });

    btnAddTask.addEventListener('click', function (event) {
        saveData();
    });

    txtSearch.addEventListener('keyup',()=>{
        searchData();
    })
}


var showModal = function () {
    // divTask.classList.add('show');
}

var saveData = () => {
    if (mode) {
        updateTask();
    } else {
        addTask();
    }
}

var addTask = () => {
    let title = txtTitle.value;
    let body = txtBody.value;

    var generator = new GenerateTask(title, body);
    generator.add();

}

var updateTask = () => {
    let title = txtTitle.value;
    let body = txtBody.value;
    let labelIds = $('.selectpicker').val();

    let index = data.findIndex((x => x.id === id));
    data[index].title = title;
    data[index].body = body;
    data[index].labelIds = labelIds

    bindData(data);
    clearFields();
    successAlert('Information', 'Task updated successfully');
    var modal = bootstrap.Modal.getInstance(divTask);
    modal.hide();
}

class GenerateTask {
    constructor(title, body) {
        this.title = title;
        this.body = body;
    }

    add() {
        const randomIdGenerator = uniqueId();
        let labelIds = $('.selectpicker').val();
        data.push({
            id: randomIdGenerator(),
            title: this.title,
            body: this.body,
            labelIds:labelIds
        });
        bindData(data);
        clearFields();
        successAlert('Information', 'Task added successfully');
        var modal = bootstrap.Modal.getInstance(divTask);
        modal.hide();

    }
}

var bindData = (data) => {
    itemArea.innerHTML = '';
    data.forEach(elem => appendTask(elem));
}

var searchData = () =>{
    let filterText = txtSearch.value;
   let filterdata = data.filter(x=>x.title.includes(filterText));
    bindData(filterdata)
}

var appendTask = (data) => {
    let labels = generateLabels(data.labelIds);
    let task = `<div class="p-5 w-100 m-2 bg-white rounded-3 shadow-lg">
        <div class="row p-1">
            <div class="col-10">
                <div class="todo-item p-1">
                    <div class="todo-item-header d-flex align-items-center">
                        <h4>${data.title}</h4>
                        <div id=''>${labels}</div>
                        <input type="hidden" value = "${data.id}" />
                        <input type="hidden" value = "${data.labelIds}" />
                    </div>
                    <div class="todo-item-body">
                        ${data.body}
                    </div>
                </div>
            </div>
            <div class="col-2 d-flex justify-content-between align-items-center">
                <i class="fas fa-edit" id="iEdit" data-bs-toggle="modal" data-bs-target="#divTask" onclick="setDataToModalForEdit(this);"></i>
                <i class="fas fa-remove" id="iRemove" onclick="removeTask(this);"></i>
            </div>
        </div>
    </div>`;

    itemArea.innerHTML = itemArea.innerHTML + task;
    let iEdit = document.getElementById('iEdit');
    // iEdit.addEventListener('click', (event) => {
    //     setDataToModalForEdit(this);
    // });

}

var setDataToModalForEdit = (e) => {
    let divTitle = e.parentNode.parentNode.querySelector('.todo-item-header');
    let title = divTitle.getElementsByTagName('h4')[0].textContent;
    id = divTitle.getElementsByTagName('input')[0].value;
    let labelIds = divTitle.getElementsByTagName('input')[1].value;

    let divBody = e.parentNode.parentNode.querySelector('.todo-item-body');
    let body = divBody.innerHTML;

    txtTitle.value = title;
    txtBody.value = body;
    console.log([labelIds]);
    $('.selectpicker').selectpicker('val',labelIds.split(","));

    mode = true;

}

var removeTask = (e) =>{
    let divTitle = e.parentNode.parentNode.querySelector('.todo-item-header');
    id = divTitle.getElementsByTagName('input')[0].value;
    
    let index = data.findIndex(x=>x.id == id);
    if (index > -1) {
        data.splice(index,1);
    }

    bindData(data);
    successAlert('Information','Task Deleted Successfully');

}

var clearFields = () => {
    txtTitle.value = '';
    txtBody.value = '';
}

var successAlert = (title, message) => {
    swal(title, message, "success");
}

var generateLabels = (ids) => {
    let labelHtml = '';
    for (let i = 0; i < ids.length; i++) {
        switch (ids[i]) {
            case '1':
                labelHtml += '<span class="ms-5 badge rounded-pill bg-danger">Bug</span>';
                break;
            case '2':
                labelHtml += '<span class="ms-5 badge rounded-pill bg-warning">Hotfix</span>';
                break;
            case '3':
                labelHtml += '<span class="ms-5 badge rounded-pill bg-primary">Todo</span>'
                break;
            case '4':
                labelHtml += '<span class="ms-5 badge rounded-pill bg-success">InProgress</span>'
                break;

            default:
                break;
        }
        
    }

    return labelHtml;
}


function uniqueId() {
    const firstItem = {
        value: "0"
    };
    /*length can be increased for lists with more items.*/
    let counter = "123456789".split('')
        .reduce((acc, curValue, curIndex, arr) => {
            const curObj = {};
            curObj.value = curValue;
            curObj.prev = acc;

            return curObj;
        }, firstItem);
    firstItem.prev = counter;

    return function () {
        let now = Date.now();
        if (typeof performance === "object" && typeof performance.now === "function") {
            now = performance.now().toString().replace('.', '');
        }
        counter = counter.prev;
        return `${now}${Math.random().toString(16).substr(2)}${counter.value}`;
    }
}