let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

export function setupTaskManager() {
    renderTasks();
    document.querySelector('.addBtn').addEventListener('click', addTask);

    const taskInput = document.getElementById('taskInput');
    taskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTask();
        }
    });

    const taskList = document.getElementById('taskList');

    taskList.addEventListener('click', (e) => {
        if (e.target.closest('.edit-btn')) {
            startEditing(e.target.closest('.edit-btn'));
        } else if (e.target.closest('.delete-btn')) {
            deleteTask(e.target.closest('.delete-btn'));
        } else if (e.target.closest('input[type="checkbox"]')) {
            toggleTaskCompletion(e.target.closest('input[type="checkbox"]'));
        } else if (e.target.closest('.done-btn')) {
            markAsDone(e.target.closest('.done-btn'));
        } else if (e.target.closest('.undo-btn')) {
            undoTask(e.target.closest('.undo-btn'));
        }
    });
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="box-text">
                <span class="task-text">${task.text}</span>
            </div>
            <div class="taskButtons">
                <span class="statusType" data-initial-bg-color="${task.initialBgColor}">${task.status}</span>

                <div class="actionBtn">
                    <button class="edit-btn"><i class='bx bx-edit-alt'></i></button>
                    <button class="delete-btn"><i class='bx bx-x'></i></button>
                </div>
                <button class="${task.status === 'Done' ? 'undo-btn' : 'done-btn'}">
                    ${task.status === 'Done' ? 'Undo' : 'Mark as done'}
                </button>
            </div>
        `;
        taskList.appendChild(li);

        // Apply styles if the task is marked as done
        if (task.status === 'Done') {
            const taskText = li.querySelector('.task-text');
            taskText.style.textDecoration = 'line-through';
            li.querySelector('.statusType').style.backgroundColor = 'green';
            li.querySelector('.edit-btn').style.display = 'none';
        }
    });
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskValue = taskInput.value.trim();

    if (taskValue === '') {
        alert('Please enter a task.');
        return;
    }

    const newTask = {
        text: taskValue,
        status: 'Pending..',
        initialBgColor: 'yellow',
    };

    tasks.push(newTask);
    saveToStorage();
    renderTasks();
    taskInput.value = '';
}

function startEditing(button) {
    const li = button.closest('li');
    const span = li.querySelector('.task-text');
    const currentText = span.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';
    input.addEventListener('blur', () => saveEdit(input));
    input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            saveEdit(input);
        } else if (event.key === 'Escape') {
            cancelEdit(input);
        }
    });

    replaceElement(span, input);
    input.focus();
}

function replaceElement(oldElement, newElement) {
    oldElement.parentNode.replaceChild(newElement, oldElement);
}


function saveEdit(input) {
    const li = input.closest('li');
    const index = [...li.parentElement.children].indexOf(li);

    tasks[index].text = input.value.trim();
    saveToStorage();
    renderTasks();
}

function cancelEdit(input) {
    const li = input.closest('li');
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = input.defaultValue.trim();
    replaceElement(input, span);
}

function deleteTask(button) {
    const li = button.closest('li');
    const index = [...li.parentElement.children].indexOf(li);

    tasks.splice(index, 1);
    saveToStorage();
    renderTasks();
}

function markAsDone(button) {
    const li = button.closest('li');
    const index = [...li.parentElement.children].indexOf(li);

    tasks[index].status = 'Done';
    tasks[index].initialBgColor = 'yellow'; // Store the initial color in data attribute
    saveToStorage();
    renderTasks();
}

export function undoTask(button) {
    const li = button.closest('li');
    const index = [...li.parentElement.children].indexOf(li);

    tasks[index].status = 'Pending..';
    tasks[index].initialBgColor = 'yellow';
    saveToStorage();
    renderTasks();
}

function saveToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
