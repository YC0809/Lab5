document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');

    // Load tasks from local storage when page loads
    loadTasks();

    // Add task when button is clicked
    addTaskButton.addEventListener('click', addTask);

    // Add task when Enter key is pressed
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }

        // Create task object
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        // Add to UI
        addTaskToUI(task);

        // Save to local storage
        saveTask(task);

        // Clear input
        taskInput.value = '';
        taskInput.focus();
    }

    function addTaskToUI(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        
        li.innerHTML = `
            <span>${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;

        taskList.appendChild(li);
        updateEmptyMessage();
    }

    function deleteTask(taskId) {
        // Remove from UI
        const taskElement = document.querySelector(`li[data-id="${taskId}"]`);
        if (taskElement) {
            taskElement.remove();
        }

        // Remove from local storage
        removeTaskFromStorage(taskId);
        updateEmptyMessage();
    }

    function saveTask(task) {
        let tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTaskFromStorage(taskId) {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(task => addTaskToUI(task));
        updateEmptyMessage();
    }

    function updateEmptyMessage() {
        if (taskList.children.length === 0) {
            taskList.innerHTML = '<div class="empty-message">No tasks yet. Add a task above!</div>';
        }
    }

    // Make deleteTask function globally available for onclick events
    window.deleteTask = deleteTask;
});