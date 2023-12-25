// Free fake API for testing and prototyping
// https://jsonplaceholder.typicode.com/
// https://jsonplaceholder.typicode.com/todos   // To access the todos
// https://jsonplaceholder.typicode.com/todos?_limit=5  // To limit todos

// With a get request we get data from a server
// With a post we send data to a server
// With put or patch we update data
// With delete...

const apiUrl = 'https://jsonplaceholder.typicode.com/todos';

// The function to fetch the data from the API
const getTodos = () => {
    fetch(apiUrl + '?_limit=5') // To limit the number of objects to be fetched
        .then(response => response.json())  // The promise
        .then(data => { // The data itself (an array of objects)
            data.forEach(todo => addTodoToDOM(todo));   // To add the todos to the DOM
        })
};

// The function to add the fetched todos to the DOM
const addTodoToDOM = (todo) => {
    const div = document.createElement('div');  // To create a new div element
    div.classList.add('todo');  // To add the class 'todo' - to select it when we want to toggle
    div.appendChild(document.createTextNode(todo.title));   // To append the title to the div
    div.setAttribute('data-id', todo.id);   // 'data-id' is the name of the attribute

    if (todo.completed) {
        div.classList.add('done');  // To add the class of 'done' when the task is done
    }

    document.getElementById('todo-list').appendChild(div);  // To append the new div to the DOM
}

// The function to create a new todo
const createTodo = (e) => {
    e.preventDefault();     // To prevent to submit

    const newTodo = {
        title: e.target.firstElementChild.value,    // To get the input value and set it as value for the key title
        completed: false    // To set the completed value to false
    }

    fetch(apiUrl, {
        method: 'POST', // The method we want to use
        body: JSON.stringify(newTodo),  // The object we want to send (stringified)
        headers: {  // The content type of the data we are sending
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())  // The promise from the 'server'
        .then(data => addTodoToDOM(data))   // To add the new crated todo to the DOM
}

// To toggle between todo done and not done
const toggleCompleted = (e) => {
    if (e.target.classList.contains('todo')) {
        e.target.classList.toggle('done');  // To toggle the class to 'done' (gray color)

        // updateTodo(id, completed)
        updateTodo(e.target.dataset.id, e.target.classList.contains('done'));
    }
}

// To update a todo element
const updateTodo = (id, completed) => {
    fetch(`${apiUrl}/${id}`, {   // To fetch the todo by its id
        method: 'PUT',  // The update request
        body: JSON.stringify({completed}),  // completed is boolean
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// To delet a todo
const deleteTodo = (e) => {
    if (e.target.classList.contains('todo')) {
        const id = e.target.dataset.id;
        fetch(`${apiUrl}/${id}`, {   // To fetch the todo by its id
            method: 'DELETE'  // The delete request
        })
        .then(response => response.json())  // We don't get any data back
        .then(() => e.target.remove()); // To remove the todo from the DOM
    }
}

// When the page loads
const init = () => {
    document.addEventListener('DOMContentLoaded', getTodos);    // To call the function getTodo when the page loads
    document.getElementById('todo-form').addEventListener('submit', createTodo);    // To call the function createTodo when submitting
    document.getElementById('todo-list').addEventListener('click', toggleCompleted);    // To toggle between still to do and completed
    document.getElementById('todo-list').addEventListener('dblclick', deleteTodo);    // To delete a todo
}

init();