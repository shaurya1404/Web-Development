const addTaskBtn = document.getElementById('add-task-btn');
const todoBoard = document.getElementById('todo-board');
const items = document.querySelectorAll('.item');
const allBoards = document.querySelectorAll('.board');
const allDeleteBtns = document.querySelectorAll('.deleteBtn');
const allEditBtns = document.querySelectorAll('.editBtn')

function attachDragEvents(item) { // Implementing the operation as a function to follow DRY princple 
    item.addEventListener('dragstart', () => {
        item.classList.add('flying')
    })
    item.addEventListener('dragend', () => {
        item.classList.remove('flying');
    })
}

function attachDeleteEvent(btn) {
    btn.addEventListener('click', () => {
        btn.parentNode.remove();
    })
}

function attachEditEvent(btn) {
    btn.addEventListener("click", () => {
        const input = prompt("Edit your task");
        if(!input) return
        const parentEl = btn.parentNode;
        parentEl.textContent = input;

        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        
        editBtn.textContent = "edit";
        deleteBtn.textContent = "-";
        editBtn.classList.add('editBtn');
        deleteBtn.classList.add('deleteBtn');

        parentEl.appendChild(editBtn);
        parentEl.appendChild(deleteBtn);

        attachEditEvent(editBtn);
        attachDeleteEvent(deleteBtn);
    })
}

addTaskBtn.addEventListener('click', () => {
    const input = prompt("Add a task");
    if(!input) return

    const newItem = document.createElement('p');
    const editBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');

    editBtn.textContent = "edit"
    deleteBtn.textContent = "-"
    newItem.textContent = input;

    editBtn.classList.add('editBtn');
    deleteBtn.classList.add('deleteBtn');
    newItem.classList.add('item');

    newItem.appendChild(editBtn);
    newItem.appendChild(deleteBtn);
    todoBoard.appendChild(newItem);

    newItem.setAttribute('draggable', true);

    attachEditEvent(editBtn); // dynamically added elements will need their events attached within the event listener itself
    attachDragEvents(newItem);
    attachDeleteEvent(newBtn);
})

items.forEach((item) => {
    attachDragEvents(item)
})

allBoards.forEach((board) => {
    board.addEventListener('dragover', () => {
        const flyingEl = document.querySelector(".flying"); // Since "flying" is a dynamically changing class, selecting the element with "flying" in the event listener itself
        console.log('Currently element', flyingEl, 'is hovering over the board', board);
        board.appendChild(flyingEl);
    })
})

allDeleteBtns.forEach((btn) => {
    attachDeleteEvent(btn)
})

allEditBtns.forEach((btn) => {
    attachEditEvent(btn);
})