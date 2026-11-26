const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCounter = document.getElementById('task-counter');
const emptyState = document.getElementById('empty-state');

let tasks = [
  { id: 1, text: 'Complete Java practice problems', completed: false },
  { id: 2, text: 'Build responsive card layout', completed: true },
  { id: 3, text: 'Review DSA notes', completed: false }
];

function updateMeta() {
  const completedCount = tasks.filter(t => t.completed).length;
  taskCounter.textContent = `${completedCount} / ${tasks.length} done`;
  emptyState.classList.toggle('visible', tasks.length === 0);
}

function renderTasks(options = {}) {
  const { animateId = null, movedId = null } = options;
  todoList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    if (task.completed) li.classList.add('completed');
    if (task.id === animateId) li.classList.add('entering');
    if (task.id === movedId) li.classList.add('moved');

    const leftDiv = document.createElement('div');
    leftDiv.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(index));

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    leftDiv.append(checkbox, span);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    const upBtn = document.createElement('button');
    upBtn.type = 'button';
    upBtn.className = 'action-btn';
    upBtn.textContent = '↑';
    upBtn.title = 'Move Up';
    upBtn.disabled = index === 0;
    upBtn.addEventListener('click', () => moveTask(index, -1));

    const downBtn = document.createElement('button');
    downBtn.type = 'button';
    downBtn.className = 'action-btn';
    downBtn.textContent = '↓';
    downBtn.title = 'Move Down';
    downBtn.disabled = index === tasks.length - 1;
    downBtn.addEventListener('click', () => moveTask(index, 1));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(index, li));

    actionsDiv.append(upBtn, downBtn, deleteBtn);
    li.append(leftDiv, actionsDiv);
    todoList.appendChild(li);
  });

  updateMeta();
}

function addTask(text) {
  const newTask = {
    id: Date.now(),
    text: text.trim(),
    completed: false
  };
  tasks.push(newTask);
  renderTasks({ animateId: newTask.id });
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function moveTask(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= tasks.length) return;

  const movedTaskId = tasks[index].id;
  [tasks[index], tasks[newIndex]] = [tasks[newIndex], tasks[index]];
  renderTasks({ movedId: movedTaskId });
}

function deleteTask(index, element) {
  element.classList.add('removing');
  element.addEventListener('animationend', () => {
    tasks.splice(index, 1);
    renderTasks();
  }, { once: true });
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = todoInput.value.trim();
  if (!value) return;

  addTask(value);
  todoInput.value = '';
  todoInput.focus();
});

renderTasks();