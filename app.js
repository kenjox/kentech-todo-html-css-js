document.addEventListener('DOMContentLoaded', function () {
  loadTodos();
});

const serverURL = 'http://localhost:3000';

function loadTodos() {
  fetch(`${serverURL}/todos`)
    .then((response) => response.json())
    .then((todos) => displayTodos(todos.slice(0, 10))); // Display only a few todos
}

function displayTodos(todos) {
  const todoList = document.getElementById('todoList');

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.innerHTML = `
        <input type="checkbox" ${
          todo.completed ? 'checked' : ''
        } onclick="toggleTodo(${todo.id})">
        <span>${todo.title}</span>
        <button class="delete-btn" onclick="deleteTodo(${
          todo.id
        })">Delete</button>
      `;
    todoList.appendChild(li);
  });
}

function addTodo() {
  const newTodo = document.getElementById('newTodo').value;

  if (newTodo.trim() !== '') {
    fetch(`${serverURL}/todos`, {
      method: 'POST',
      body: JSON.stringify({
        title: newTodo,
        completed: false,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(() => {
        document.getElementById('newTodo').value = '';
        refreshTodos();
      });
  }
}

function toggleTodo(id) {
  fetch(`${serverURL}/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      completed: true,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then(() => refreshTodos());
}

function deleteTodo(id) {
  fetch(`${serverURL}/todos/${id}`, {
    method: 'DELETE',
  }).then(() => refreshTodos());
}

function refreshTodos() {
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = '';
  loadTodos();
}
