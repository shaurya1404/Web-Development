let rightClickedCard = null

document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage()); // whenever the DOM is loaded, also load all the data stored in the local storage

document.addEventListener("click", () => { // clicking anywhere on the document (DOM) will remove the context menu (if present)
    contextmenu.style.display = "none"
})

const addTaskBtns = document.getElementsByClassName("add-task");
for (const btn of addTaskBtns) {
    btn.addEventListener("click", () => {
        const fullId = btn.id;
        const columnId = fullId.replace("-btn", "");
        addTask(columnId);
    })
}

function addTask(columnId) {
    const input = document.getElementById(`${columnId}-input`);
    const taskText = input.value.trim(); // only whitespaces cannot be passed because of .trim()
    const taskDate = new Date().toLocaleString(); // gives the date and time when the object was created. Using toLocaleString to convert it to a suitable format
    
    if(taskText == "") {
        return
    }

    const taskElement = createTaskElement(taskText, taskDate);
    document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
    updateTaskCounter(columnId);
    input.value = '';

    saveTasksToLocalStorage(columnId, taskText, taskDate);
}

function createTaskElement(taskText, taskDate) {
    const taskElement = document.createElement('div');
    taskElement.innerHTML = `<span>${taskText}</span><br><small class='task-date'>${taskDate}</small>`;
    taskElement.classList.add("card");
    taskElement.draggable = true;
    taskElement.addEventListener("dragstart", dragStart);
    taskElement.addEventListener("dragend", dragEnd);
    taskElement.addEventListener("contextmenu", function (event) { // contextmenu == right click
        rightClickedCard = this // for editBtn and deleteBtn functionalities
        event.preventDefault(); // Prevent default right click menu from popping up
        showContextMenu(event.pageX, event.pageY);
    })
    return taskElement
}

function dragStart() {
    this.classList.add("dragging");
}

function dragEnd() {
    this.classList.remove("dragging");
    ["todo", "doing", "done"].forEach((element) => {
        console.log(element);
        updateTaskCounter(element);
    })
    updateLocalStorage();
}

const contextmenu = document.querySelector(".context-menu")
function showContextMenu(x, y) {
    contextmenu.style.left = `${x}px`;
    contextmenu.style.top = `${y}px`;
    contextmenu.style.display = "block"
}

const columns = document.getElementsByClassName("tasks");
for (const column of columns) {
    column.addEventListener("dragover", dragOver)
}

function dragOver (event) {
    event.preventDefault(); // By default, HTML doesn't allow drag-and-drop. So, even though the functionality works because of the subsequent lines, the animation in the DOM  will show that the event is returning to its orginial spot
    // const draggedElement = document.getElementsByClassName("dragging"); --> cannot be used as getElementsByClassName always returns an array-like object of elements, not a single node (even if just one element is selected)
    const draggedElement = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(this, event.pageY); // this = column from column.addEventListener
    
    if(afterElement == null) {
        this.appendChild(draggedElement); // this = column from column.addEventListener
    }
    else {
        this.insertBefore(draggedElement, afterElement)
    }
}

function getDragAfterElement(column, y) { // y = current postion of the mouse
    const allCardsInColumn = [
        ...column.querySelectorAll(".card:not(.dragging)") // the querySelectorAll always returns a NodeList (a collection of nodes) 
    ] // ... spread operator for: NodeList => Array
    
    const result = allCardsInColumn.reduce((closestTaskToMouse, currentTask) => {
        const box = currentTask.getBoundingClientRect(); // .getBoundingClientRect() returns a DOMRectangle object which has all the properties of currentTask about its size and position relative to the viewport
        const offset = y - (box.top + box.height/2); // box.top = distance of currentTask from top of the viewport and box.height/2 = distance from the start of the task to its middle
        if(offset < 0 && offset > closestTaskToMouse.offset) {
            return {offset: offset, element: currentTask}
        } 
        else {
            return closestTaskToMouse
        }
    }, {offset: Number.NEGATIVE_INFINITY})
    return result.element
}

const editBtn = document.getElementById("edit");
editBtn.addEventListener("click", (event) => {
    if(rightClickedCard != null) {
        const newValue = prompt("Edit task - ", rightClickedCard.querySelector("span").textContent);
        
        if(newValue != "") {
            rightClickedCard.querySelector("span").textContent = newValue;
            updateLocalStorage();
        }
    }
})

const deleteBtn = document.getElementById("delete");
deleteBtn.addEventListener("click", () => {
    if(rightClickedCard != null) {
        const columnId = rightClickedCard.parentElement.id.replace("-tasks", "");
        console.log(columnId);
        rightClickedCard.remove();
        updateLocalStorage();
        updateTaskCounter(columnId);
    }
})

function updateTaskCounter (columnId) {
    console.log(`#${columnId}-tasks .card`)
    const count = document.querySelectorAll(`#${columnId}-tasks .card`).length;
    console.log(count)
    const counter = document.getElementById(`${columnId}-counter`);
    counter.textContent = count;
}

function saveTasksToLocalStorage(columnId, taskText, taskDate) {
    const tasks = JSON.parse(localStorage.getItem(columnId)) || [] // Getting previous items stored in the columnID, if any
    tasks.push({text: taskText, date: taskDate})
    localStorage.setItem(columnId, JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    ["todo", "doing", "done"].forEach((columnId) => {
        const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
        tasks.forEach(({text, date}) => { // destructuring each task to obtain its text and its date
            const taskElement = createTaskElement(text, date)
            document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
        })
        updateTaskCounter(columnId); // To update task counter for each columnID after all its tasks have been appended
    })
}

function updateLocalStorage() { // To update the local changes whenever changes (edit/delete/dragEnd) are made to any of the tasks
    ["todo", "doing", "done"].forEach((columnId) => {
        const tasks = [];
        document.querySelectorAll(`#${columnId}-tasks .card`).forEach((card) => {
            const taskText = card.querySelector("span").textContent;
            const taskDate = card.querySelector("small").textContent;
            tasks.push({text: taskText, date: taskDate});
        })
        localStorage.setItem(columnId, JSON.stringify(tasks));
    })
}