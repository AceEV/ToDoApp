console.log("Hello");
newTodo_URL = "http://localhost:5000/newTodo";
fetchAllTasks_URL = "http://localhost:5000/fetchAllTasks";
completeTask_URL = "http://localhost:5000/completeTask";
uncompleteTask_URL = "http://localhost:5000/uncompleteTask";
var x=0,y;
updateTaskList();

function makedate(datetime){
        var dd = datetime.getDate() + 1; 
        var mm = datetime.getMonth() + 1; 
  
        var yyyy = datetime.getFullYear(); 
        if (dd < 10) { 
            dd = '0' + dd; 
        } 
        if (mm < 10) { 
            mm = '0' + mm; 
        } 
        return(yyyy + '-' + mm + '-' + dd); 
}

function appendRowToTable(row, taskListTable, checked){
    const tr = document.createElement('tr');

    const check = document.createElement('td')
    const check1 = document.createElement('input');
    var att = document.createAttribute("type");
    att.value = "checkbox";
    check1.setAttributeNode(att);
    checked ? check1.setAttribute("checked", "true") : "";
    var att = document.createAttribute("id");
    att.value = "check"+row["id"];
    check1.setAttributeNode(att);
    var att = document.createAttribute("class");
    att.value = "checks";
    check1.setAttributeNode(att);
    check.appendChild(check1);

    const title = document.createElement('td')
    title.textContent = row["title"];
    const description = document.createElement('td')
    description.textContent = row["description"];
    const date = document.createElement('td')
    date.textContent = row["date"];

    // div.appendChild(id);
    tr.appendChild(check);
    tr.appendChild(title);
    tr.appendChild(description);
    tr.appendChild(date);
    taskListTable.appendChild(tr);
}


const form  = document.querySelector('form');

form.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log("Event -> " + event);
        y=event;
        console.log("Got stuff");
        const formData = new FormData(form);
        const title = formData.get('todo_title');
        const desc = formData.get('todo_desc');
        var date = "";
        if(formData.get('todo_date') != ""){
            const timestamp = new Date(formData.get('todo_date'));x=timestamp;
            date = makedate(timestamp);
        }
        const newTodo = {"title" : title, "desc" : desc, "date" : date} 
        console.log(newTodo);

        fetch(newTodo_URL, {
            method: 'POST',
            body : JSON.stringify(newTodo),
            headers:{'content-type':'application/json'}
        })
        .then(res => res.json())
        .then(response => {
            console.log("Response -> \n" + response);
            console.log(typeof(response));
            updateTaskList();
        });
    }
);

function addEventListenersToBoxes(){
        var checkboxes = document.getElementsByClassName("checks");
        console.log(checkboxes);
    
        for (var i = 0; i < checkboxes.length; i++) {
            // console.log("Adding event listner");
            checkboxes[i].addEventListener('click', (event) => {
                console.log("Clicked "+event.srcElement.id);
                checkboxID = {"id" :event.srcElement.id}
                update_URL = document.getElementById(event.srcElement.id).checked ? completeTask_URL : uncompleteTask_URL;
                fetch(update_URL, {
                    method: 'POST',
                    body: JSON.stringify(checkboxID),
                    headers:{'content-type':'application/json'}
                })
                .then(res => res.json())
                .then(response => {
                    console.log("Response -> \n" + response);
                    updateTaskList();
                });
            });
        }
}


function updateTaskList(){
    const pendingTaskList = document.querySelector('#tasks');
    const completedTasksList = document.querySelector('#completedTasks');
    pendingTaskList.innerHTML="";
    completedTasksList.innerHTML="";
    
    fetch(fetchAllTasks_URL, {
        method: 'POST',
        body : "",
        headers:{'content-type':'application/json'}
    })
    .then(res => res.json())
    .then(response => {
        console.log("All Tasks :\n");
        // console.log(response.pending);
        // console.log(response.completed);

        getTable(response.pending, pendingTaskList, false);
        getTable(response.completed, completedTasksList, true);
        addEventListenersToBoxes();
        
    });
}

function getTable(listOfTasks, whichList, checked){
    var taskListTable = document.createElement("table");
        const tableRow = document.createElement('tr');
            const title = document.createElement('th');
                title.textContent = "TITLE";
            const description = document.createElement('th');
                description.textContent = "DESCRIPTION";
            const date = document.createElement('th');
                date.textContent = "DEADLINE";
        
        tableRow.appendChild(document.createElement('th'));
        tableRow.appendChild(title);
        tableRow.appendChild(description);
        tableRow.appendChild(date);
    taskListTable.appendChild(tableRow);

    // return taskListTable;
    listOfTasks.forEach((row) => {
        // console.log(row["title"] + "  " + row["date"]+ "  " + row["description"] + "  " +checked);
        appendRowToTable(row, taskListTable, checked);
    });
    whichList.appendChild(taskListTable);
    console.log("TaskList Updated "+ checked.toString());
}