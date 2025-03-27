// Task Manager Class
class TaskManager {
    constructor() {
        if (!auth.currentUser) {
            window.location.href = 'auth.html';
            return;
        }
        this.tasks = JSON.parse(localStorage.getItem(`tasks_${auth.currentUser.id}`)) || [];
        this.currentFilter = 'all';
        this.updateNavigation();
        this.init();
    }

    updateNavigation() {
        const authButtons = document.getElementById('auth-buttons');
        if (auth.currentUser) {
            authButtons.innerHTML = `
                <button class="auth-btn" onclick="auth.logout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
            `;
        } else {
            authButtons.innerHTML = `
                <a href="login.html" class="auth-btn">Login</a>
                <a href="register.html" class="auth-btn">Register</a>
            `;
        }
    }

    init() {
        // Add logout button
        const header = document.querySelector('header');
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'filter-btn';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutBtn.onclick = () => auth.logout();
        header.appendChild(logoutBtn);

        // Initialize other event listeners
        const addTaskBtn = document.getElementById('add-task-btn');
        const modal = document.getElementById('add-task-modal');
        const closeModal = document.querySelector('.close-modal');
        const addTaskForm = document.getElementById('add-task-form');

        addTaskBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        addTaskForm.addEventListener('submit', (e) => {
            this.addTask(e);
            modal.style.display = 'none';
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => this.filterTasks(btn.dataset.filter));
        });

        // Initial render
        this.renderTasks();
    }

    addTask(e) {
        e.preventDefault();
        const taskInput = document.getElementById('task-input');
        const taskDescription = document.getElementById('task-description');
        const dueDate = document.getElementById('due-date');
        const priority = document.getElementById('priority');

        const task = {
            id: Date.now(),
            title: taskInput.value,
            description: taskDescription.value,
            dueDate: dueDate.value,
            priority: priority.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();

        // Reset form
        e.target.reset();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const newTitle = prompt('Edit task:', task.title);
        if (newTitle !== null && newTitle.trim() !== '') {
            task.title = newTitle.trim();
            this.saveTasks();
            this.renderTasks();
        }
    }

    filterTasks(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.renderTasks();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    saveTasks() {
        localStorage.setItem(`tasks_${auth.currentUser.id}`, JSON.stringify(this.tasks));
    }

    renderTasks() {
        const tasksList = document.getElementById('tasks-list');
        const filteredTasks = this.getFilteredTasks();

        tasksList.innerHTML = filteredTasks
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" 
                           class="task-checkbox" 
                           ${task.completed ? 'checked' : ''}
                           onchange="taskManager.toggleTask(${task.id})">
                    <div class="task-content">
                        <div class="task-title">${task.title}</div>
                        <div class="task-description">${task.description}</div>
                        <div class="task-details">
                            Due: ${new Date(task.dueDate).toLocaleDateString()}
                            <span class="priority-indicator priority-${task.priority}">
                                ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="edit-btn" onclick="taskManager.editTask(${task.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
    }
}

// Initialize Task Manager
const taskManager = new TaskManager();