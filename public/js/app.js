// TaskFlow - Modern Task Management App
// Main application JavaScript

class TaskFlowApp {
    constructor() {
        this.currentUser = null;
        this.tasks = [];
        this.currentTab = 'login';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthState();
        this.loadTasks();
    }

    setupEventListeners() {
        // Auth modal events
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-tab]')) {
                this.switchAuthTab(e.target.dataset.tab);
            }
        });

        // Auth form submission
        document.getElementById('auth-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAuth();
        });

        // Add task form
        document.getElementById('add-task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Sort select
        document.getElementById('sort-select').addEventListener('change', () => {
            this.loadTasks();
        });

        // Close modal on backdrop click
        document.querySelector('.modal-backdrop').addEventListener('click', () => {
            this.hideAuthModal();
        });
    }

    // Authentication Methods
    async handleAuth() {
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;
        const name = document.getElementById('auth-name').value.trim();

        if (!email || !password) {
            this.showAuthMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (password.length < 6) {
            this.showAuthMessage('Password must be at least 6 characters.', 'error');
            return;
        }

        this.showLoading(true);

        try {
            const endpoint = this.currentTab === 'login' ? '/api/auth/login' : '/api/auth/register';
            const body = this.currentTab === 'login' 
                ? { email, password }
                : { email, password, name };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok) {
                this.currentUser = data.user;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                this.showAuthMessage(data.message, 'success');
                
                setTimeout(() => {
                    this.hideAuthModal();
                    this.showAppPage();
                    this.loadTasks();
                }, 1000);
            } else {
                this.showAuthMessage(data.error, 'error');
            }
        } catch (error) {
            console.error('Auth error:', error);
            this.showAuthMessage('An error occurred. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    switchAuthTab(tab) {
        this.currentTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // Update form
        const nameField = document.getElementById('name-field');
        const submitText = document.getElementById('auth-submit-text');
        const modalTitle = document.getElementById('modal-title');

        if (tab === 'signup') {
            nameField.style.display = 'block';
            submitText.textContent = 'Sign Up';
            modalTitle.textContent = 'Create Your Account';
        } else {
            nameField.style.display = 'none';
            submitText.textContent = 'Login';
            modalTitle.textContent = 'Welcome Back';
        }

        this.clearAuthMessage();
    }

    showAuthMessage(message, type) {
        const messageEl = document.getElementById('auth-message');
        messageEl.textContent = message;
        messageEl.className = `auth-message ${type}`;
    }

    clearAuthMessage() {
        const messageEl = document.getElementById('auth-message');
        messageEl.textContent = '';
        messageEl.className = 'auth-message';
    }

    showAuthModal(type = 'login') {
        this.switchAuthTab(type);
        document.getElementById('auth-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideAuthModal() {
        document.getElementById('auth-modal').classList.remove('active');
        document.body.style.overflow = '';
        this.clearAuthMessage();
        
        // Clear form
        document.getElementById('auth-form').reset();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showLandingPage();
    }

    checkAuthState() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showAppPage();
        } else {
            this.showLandingPage();
        }
    }

    showLandingPage() {
        document.getElementById('landing-page').classList.add('active');
        document.getElementById('app-page').classList.remove('active');
    }

    showAppPage() {
        document.getElementById('landing-page').classList.remove('active');
        document.getElementById('app-page').classList.add('active');
        
        if (this.currentUser) {
            const greeting = document.getElementById('user-greeting');
            greeting.textContent = `Welcome back, ${this.currentUser.name || this.currentUser.email}!`;
        }

        // Ensure narrow container for app layout
        const appContainers = document.querySelectorAll('.app-container');
        appContainers.forEach(c => c.classList.add('narrow'));
    }

    // Task Management Methods
    async loadTasks() {
        if (!this.currentUser) return;

        this.showLoading(true);

        try {
            const sortSelect = document.getElementById('sort-select');
            const [sortBy, sortOrder] = sortSelect.value.split('-');
            
            const response = await fetch(`/api/tasks?sortBy=${sortBy}&sortOrder=${sortOrder}`, {
                headers: {
                    'x-user-id': this.currentUser.id.toString()
                }
            });

            if (response.ok) {
                this.tasks = await response.json();
                this.renderTasks();
                this.updateTaskStats();
            } else {
                console.error('Failed to load tasks');
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async addTask() {
        if (!this.currentUser) return;

        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-description').value.trim();
        const dueDate = document.getElementById('task-due-date').value;
        const priority = document.getElementById('task-priority').value;

        if (!title) {
            this.showNotification('Please enter a task title.', 'error');
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': this.currentUser.id.toString()
                },
                body: JSON.stringify({
                    title,
                    description: description || null,
                    dueDate: dueDate || null,
                    priority
                })
            });

            if (response.ok) {
                document.getElementById('add-task-form').reset();
                this.loadTasks();
                this.showNotification('Task added successfully!', 'success');
            } else {
                const data = await response.json();
                this.showNotification(data.error || 'Failed to add task', 'error');
            }
        } catch (error) {
            console.error('Error adding task:', error);
            this.showNotification('An error occurred. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async updateTask(taskId, updates) {
        if (!this.currentUser) return;

        this.showLoading(true);

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': this.currentUser.id.toString()
                },
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                this.loadTasks();
                this.showNotification('Task updated successfully!', 'success');
            } else {
                const data = await response.json();
                this.showNotification(data.error || 'Failed to update task', 'error');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            this.showNotification('An error occurred. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async deleteTask(taskId) {
        if (!this.currentUser) return;

        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'x-user-id': this.currentUser.id.toString()
                }
            });

            if (response.ok) {
                this.loadTasks();
                this.showNotification('Task deleted successfully!', 'success');
            } else {
                const data = await response.json();
                this.showNotification(data.error || 'Failed to delete task', 'error');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            this.showNotification('An error occurred. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    renderTasks() {
        const tasksList = document.getElementById('tasks-list');
        const emptyState = document.getElementById('empty-state');

        if (this.tasks.length === 0) {
            tasksList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        tasksList.style.display = 'block';
        emptyState.style.display = 'none';

        tasksList.innerHTML = this.tasks.map(task => this.createTaskElement(task)).join('');
        
        // Reinitialize Lucide icons for dynamically added content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    createTaskElement(task) {
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null;
        const isOverdue = dueDate && new Date(task.dueDate) < new Date() && !task.completed;
        
        return `
            <div class="task-item-app ${task.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="app.toggleTaskComplete(${task.id}, this.checked)"
                >
                <div class="task-content">
                    <div class="task-title ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.title)}</div>
                    <div class="task-meta">
                        ${task.description ? `<span><i data-lucide="file-text" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>${this.escapeHtml(task.description)}</span>` : ''}
                        <span class="task-priority ${task.priority.toLowerCase()}">
                            <i data-lucide="${this.getPriorityIcon(task.priority)}" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 2px;"></i>
                            ${task.priority}
                        </span>
                        ${dueDate ? `<span class="${isOverdue ? 'text-red-500' : ''}"><i data-lucide="calendar" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>Due: ${dueDate}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn btn-outline btn-sm" onclick="app.editTask(${task.id})">
                        <i data-lucide="edit-2" class="btn-icon-sm"></i>
                        Edit
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="app.deleteTask(${task.id})">
                        <i data-lucide="trash-2" class="btn-icon-sm"></i>
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    getPriorityIcon(priority) {
        const icons = {
            'LOW': 'arrow-down',
            'MEDIUM': 'minus',
            'HIGH': 'arrow-up',
            'URGENT': 'alert-circle'
        };
        return icons[priority] || 'minus';
    }

    toggleTaskComplete(taskId, completed) {
        this.updateTask(taskId, { completed });
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const newTitle = prompt('Edit task title:', task.title);
        if (newTitle === null || newTitle.trim() === '') return;

        const newDescription = prompt('Edit description (optional):', task.description || '');
        if (newDescription === null) return;

        const newDueDate = prompt('Edit due date (YYYY-MM-DD, optional):', 
            task.dueDate ? task.dueDate.split('T')[0] : '');
        if (newDueDate === null) return;

        const newPriority = prompt('Edit priority (LOW, MEDIUM, HIGH, URGENT):', task.priority);
        if (newPriority === null) return;

        const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
        if (!validPriorities.includes(newPriority.toUpperCase())) {
            this.showNotification('Invalid priority. Please use LOW, MEDIUM, HIGH, or URGENT.', 'error');
            return;
        }

        this.updateTask(taskId, {
            title: newTitle.trim(),
            description: newDescription.trim() || null,
            dueDate: newDueDate.trim() || null,
            priority: newPriority.toUpperCase()
        });
    }

    updateTaskStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        
        const statsEl = document.getElementById('task-stats');
        statsEl.innerHTML = `
            <span class="stat">
                <i data-lucide="list" class="stat-icon"></i>
                ${total} total
            </span>
            <span class="stat">
                <i data-lucide="check-circle" class="stat-icon"></i>
                ${completed} completed
            </span>
        `;
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Utility Methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.toggle('active', show);
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '4000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
            backgroundColor: type === 'success' ? '#10b981' : '#ef4444'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Global functions for HTML onclick handlers
function showAuthModal(type) {
    app.showAuthModal(type);
}

function hideAuthModal() {
    app.hideAuthModal();
}

function logout() {
    app.logout();
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TaskFlowApp();
});

