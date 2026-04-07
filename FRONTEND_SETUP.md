# Frontend Setup Guide

## Quick Start

This guide helps you set up and integrate the Task Manager backend API with your frontend application.

---

## Prerequisites

- Node.js 14+ installed
- npm or yarn
- Modern browser with fetch API support
- Backend server running on `http://localhost:5000`

---

## Step 1: Verify Backend is Running

Before starting frontend development, ensure the backend is running:

```bash
# Terminal 1: Start the backend
cd Task_AI
npm run dev
# You should see: "Server running on 5000"
```

Test the backend health:
```bash
curl http://localhost:5000/api/health
# Response: {"status":"Server is running","timestamp":"2026-04-07T..."}
```

---

## Step 2: Create Frontend Client Service

### For React

1. Create a services directory:
```bash
mkdir src/services
touch src/services/taskService.ts
```

2. Add the task service:

```typescript
// src/services/taskService.ts

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  category: string;
  date: string;
  status: 'pending' | 'completed' | 'incomplete';
  priority: 'low' | 'medium' | 'high';
  completedAt?: string;
  linkedFromDate?: string;
  isCarriedOver: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  category: string;
  date?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface CategoryStats {
  category: string;
  total: number;
  completed: number;
  pending: number;
  incomplete: number;
  completionPercentage: string;
}

export interface TaskResponse<T = Task | Task[]> {
  success: boolean;
  message?: string;
  task?: T;
  tasks?: Task[];
  data?: any;
  error?: string;
}

class TaskService {
  private apiUrl = `${API_BASE_URL}/tasks`;

  // Create a new task
  async createTask(taskData: TaskInput): Promise<TaskResponse<Task>> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  }

  // Get today's tasks
  async getTodayTasks(): Promise<TaskResponse<Task[]>> {
    const response = await fetch(`${this.apiUrl}/today`);
    if (!response.ok) throw new Error('Failed to fetch today tasks');
    return response.json();
  }

  // Get tasks for a specific date
  async getTasksByDate(date: string): Promise<TaskResponse<Task[]>> {
    const response = await fetch(`${this.apiUrl}/date/${date}`);
    if (!response.ok) throw new Error('Failed to fetch tasks for date');
    return response.json();
  }

  // Get tasks for a date range
  async getTasksByDateRange(startDate: string, endDate: string): Promise<TaskResponse<Task[]>> {
    const response = await fetch(
      `${this.apiUrl}?startDate=${startDate}&endDate=${endDate}`
    );
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  }

  // Get incomplete tasks from previous days
  async getIncompleteTasksFromPreviousDays(): Promise<TaskResponse<Task[]>> {
    const response = await fetch(`${this.apiUrl}/incomplete/previous`);
    if (!response.ok) throw new Error('Failed to fetch incomplete tasks');
    return response.json();
  }

  // Update a task
  async updateTask(id: string, updates: Partial<TaskInput>): Promise<TaskResponse<Task>> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  }

  // Mark task as complete
  async markTaskComplete(id: string): Promise<TaskResponse<Task>> {
    const response = await fetch(`${this.apiUrl}/${id}/complete`, {
      method: 'PATCH'
    });
    if (!response.ok) throw new Error('Failed to complete task');
    return response.json();
  }

  // Delete a task
  async deleteTask(id: string): Promise<TaskResponse<Task>> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return response.json();
  }

  // Complete all tasks for a date
  async completeAllTasksForDate(date: string): Promise<TaskResponse> {
    const response = await fetch(`${this.apiUrl}/complete-all/${date}`, {
      method: 'PATCH'
    });
    if (!response.ok) throw new Error('Failed to complete all tasks');
    return response.json();
  }

  // Get last 90 days tasks
  async getLast90DaysTasks(): Promise<TaskResponse<Task[]>> {
    const response = await fetch(`${this.apiUrl}/last90days`);
    if (!response.ok) throw new Error('Failed to fetch 90 days tasks');
    return response.json();
  }

  // Get category statistics
  async getCategoryStats(): Promise<any> {
    const response = await fetch(`${this.apiUrl}/stats/category`);
    if (!response.ok) throw new Error('Failed to fetch category stats');
    return response.json();
  }

  // Get progress by category
  async getProgressByCategory(): Promise<any> {
    const response = await fetch(`${this.apiUrl}/stats/progress`);
    if (!response.ok) throw new Error('Failed to fetch progress');
    return response.json();
  }
}

export const taskService = new TaskService();
```

3. Add environment variable to `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Step 3: Create UI Components

### Example: Today's Tasks Component

```typescript
// src/components/TodayTasks.tsx

import React, { useState, useEffect } from 'react';
import { Task, taskService } from '../services/taskService';

export const TodayTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    incompleteTasks: 0
  });

  useEffect(() => {
    fetchTodayTasks();
  }, []);

  const fetchTodayTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTodayTasks();
      setTasks(data.tasks || []);
      setStats({
        totalTasks: data.totalTasks,
        completedTasks: data.completedTasks,
        pendingTasks: data.pendingTasks,
        incompleteTasks: data.incompleteTasks
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await taskService.markTaskComplete(taskId);
      await fetchTodayTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      await fetchTodayTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="today-tasks">
      <h1>Today's Tasks</h1>
      
      {/* Stats Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalTasks}</h3>
          <p>Total Tasks</p>
        </div>
        <div className="stat-card">
          <h3>{stats.completedTasks}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pendingTasks}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{stats.incompleteTasks}</h3>
          <p>Incomplete</p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p>No tasks for today</p>
        ) : (
          tasks.map(task => (
            <div 
              key={task._id} 
              className={`task-card status-${task.status}`}
            >
              <div className="task-header">
                <h2>{task.title}</h2>
                <span className={`badge badge-${task.priority}`}>
                  {task.priority}
                </span>
              </div>

              {task.description && <p>{task.description}</p>}

              <div className="task-meta">
                <span className="category">{task.category}</span>
                <span className={`status status-${task.status}`}>
                  {task.status}
                </span>
              </div>

              <div className="task-actions">
                {task.status !== 'completed' && (
                  <button 
                    onClick={() => handleCompleteTask(task._id)}
                    className="btn btn-complete"
                  >
                    Complete
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteTask(task._id)}
                  className="btn btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
```

### Example: Progress Chart Component

```typescript
// src/components/ProgressChart.tsx

import React, { useState, useEffect } from 'react';
import { taskService, CategoryStats } from '../services/taskService';

export const ProgressChart: React.FC = () => {
  const [stats, setStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  const fetchCategoryStats = async () => {
    try {
      setLoading(true);
      const data = await taskService.getCategoryStats();
      setStats(data.categories || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="progress-chart">
      <h2>Category Progress (Last 90 Days)</h2>
      
      <div className="categories-grid">
        {stats.map(category => (
          <div key={category.category} className="category-card">
            <h3>{category.category}</h3>
            
            {/* Progress Bar */}
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: category.completionPercentage }}
              >
              </div>
            </div>

            {/* Stats */}
            <div className="category-stats">
              <p className="percentage">{category.completionPercentage}</p>
              <p className="details">
                Completed: {category.completed}/{category.total}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## Step 4: Create Add Task Form

```typescript
// src/components/AddTaskForm.tsx

import React, { useState } from 'react';
import { TaskInput, taskService } from '../services/taskService';

interface AddTaskFormProps {
  onTaskAdded: () => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onTaskAdded }) => {
  const [formData, setFormData] = useState<TaskInput>({
    title: '',
    description: '',
    category: 'DSA',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'DSA',
    'Docker',
    'Problem Solving',
    'Projects',
    'Learning',
    'Code Review',
    'Other'
  ];

  const priorities = ['low', 'medium', 'high'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      await taskService.createTask(formData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'DSA',
        priority: 'medium'
      });

      onTaskAdded();
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <h2>Add New Task</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Task Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description (optional)"
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            {priorities.map(pri => (
              <option key={pri} value={pri}>
                {pri.charAt(0).toUpperCase() + pri.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
};
```

---

## Step 5: Basic CSS Styling

```css
/* src/styles/tasks.css */

.today-tasks {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.stat-card {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.stat-card h3 {
  font-size: 24px;
  margin: 0;
  color: #333;
}

.stat-card p {
  margin: 5px 0 0;
  color: #666;
  font-size: 14px;
}

/* Tasks List */
.tasks-list {
  display: grid;
  gap: 15px;
  margin-top: 20px;
}

.task-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
}

.task-card.status-completed {
  background-color: #f0f8f0;
  border-color: #4CAF50;
}

.task-card.status-pending {
  background-color: #fff9f0;
  border-color: #FF9800;
}

.task-card.status-incomplete {
  background-color: #f8f0f0;
  border-color: #f44336;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 10px;
}

.task-header h2 {
  margin: 0;
  font-size: 18px;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.badge-high { background: #f44336; color: white; }
.badge-medium { background: #FF9800; color: white; }
.badge-low { background: #4CAF50; color: white; }

.task-meta {
  display: flex;
  gap: 10px;
  margin: 10px 0;
  font-size: 12px;
}

.category {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 4px;
}

.status {
  background: #f5f5f5;
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
}

.task-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-complete {
  background: #4CAF50;
  color: white;
}

.btn-complete:hover {
  background: #45a049;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.btn-delete:hover {
  background: #da190b;
}

/* Progress Chart */
.progress-chart {
  padding: 20px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.category-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.category-card h3 {
  margin-top: 0;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.category-stats {
  text-align: center;
}

.percentage {
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0 5px;
}

.details {
  color: #666;
  font-size: 12px;
}

/* Form */
.add-task-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 500px;
  margin: 20px 0;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}
```

---

## Step 6: Environment Setup

Create `.env` file in your frontend root:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

---

## Step 7: Run Frontend

```bash
npm start
# Frontend will open at http://localhost:3000
```

---

## Troubleshooting

### CORS Errors

If you get CORS errors, ensure:
1. Backend is running and CORS is enabled
2. Frontend URL matches CORS policies
3. Use proper content-type headers

### API Errors

- Check backend is running: `npm run dev` in Task_AI folder
- Test with curl: `curl http://localhost:5000/api/health`
- Check browser console for detailed error messages

### Date Issues

Always use `YYYY-MM-DD` format:
```typescript
const today = new Date().toISOString().split('T')[0]; // '2026-04-07'
```

---

## Next Steps

1. ✅ Create service layer
2. ✅ Build components
3. ✅ Add styling
4. 🔄 Deploy to production
5. 🔄 Add authentication
6. 🔄 Implement caching
7. 🔄 Add animations

---

## Integration Checklist

- [ ] Backend running and accessible
- [ ] Task service created with all methods
- [ ] Environment variables configured
- [ ] React components created
- [ ] Styling applied
- [ ] Forms working
- [ ] Data fetching working
- [ ] CRUD operations functional
- [ ] Error handling implemented
- [ ] Performance optimized

---

Happy Coding! 🚀
