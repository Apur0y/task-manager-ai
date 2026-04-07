# Task Manager Frontend Integration Guide

## Overview

This is a comprehensive Task Manager application backend that allows users to manage daily tasks, track progress, and maintain historical task data for up to 90 days. The system supports task categorization, status tracking, and automatic task carryover from previous days.

## Base URL

```
http://localhost:5000/api
```

## Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete tasks
- ✅ **Daily Task Management**: Fetch and manage tasks for any specific date
- ✅ **Task Categories**: DSA, Docker, Problem Solving, Projects, Learning, Code Review, Other
- ✅ **Task Status Tracking**: Pending, Completed, Incomplete
- ✅ **Progress Tracking**: Get completion percentage by category
- ✅ **Historical Data**: Maintain up to 90 days of task history
- ✅ **Incomplete Task Management**: Track and manage incomplete tasks from previous days
- ✅ **Priority Levels**: Low, Medium, High

---

## API Endpoints

### 1. Create a New Task

**Endpoint**: `POST /tasks`

**Description**: Create a new task for a specific date and category.

**Request Body**:
```json
{
  "title": "Complete DSA Binary Trees",
  "description": "Study and practice binary tree problems",
  "category": "DSA",
  "date": "2026-04-07",
  "priority": "high"
}
```

**Fields**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | ✅ | Task title |
| description | string | ❌ | Optional task description |
| category | string | ✅ | One of: DSA, Docker, Problem Solving, Projects, Learning, Code Review, Other |
| date | string | ❌ | Format: YYYY-MM-DD. Defaults to today |
| priority | string | ❌ | One of: low, medium, high. Default: medium |

**Response** (201):
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete DSA Binary Trees",
    "description": "Study and practice binary tree problems",
    "category": "DSA",
    "date": "2026-04-07T00:00:00.000Z",
    "status": "pending",
    "priority": "high",
    "completedAt": null,
    "linkedFromDate": null,
    "isCarriedOver": false,
    "createdAt": "2026-04-07T10:30:00.000Z",
    "updatedAt": "2026-04-07T10:30:00.000Z"
  }
}
```

**Example (cURL)**:
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete DSA Binary Trees",
    "description": "Study and practice binary tree problems",
    "category": "DSA",
    "date": "2026-04-07",
    "priority": "high"
  }'
```

**Example (JavaScript/Fetch)**:
```javascript
const createTask = async (taskData) => {
  const response = await fetch('http://localhost:5000/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  return response.json();
};

// Usage
createTask({
  title: "Complete DSA Binary Trees",
  description: "Study and practice binary tree problems",
  category: "DSA",
  date: "2026-04-07",
  priority: "high"
});
```

---

### 2. Get Today's Tasks

**Endpoint**: `GET /tasks/today`

**Description**: Fetch all tasks for today with summary statistics.

**Response** (200):
```json
{
  "success": true,
  "date": "Sun Apr 07 2026",
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete DSA Binary Trees",
      "description": "Study and practice binary tree problems",
      "category": "DSA",
      "date": "2026-04-07T00:00:00.000Z",
      "status": "pending",
      "priority": "high",
      "completedAt": null,
      "linkedFromDate": null,
      "isCarriedOver": false,
      "createdAt": "2026-04-07T10:30:00.000Z",
      "updatedAt": "2026-04-07T10:30:00.000Z"
    }
  ],
  "totalTasks": 5,
  "completedTasks": 2,
  "pendingTasks": 2,
  "incompleteTasks": 1
}
```

**Example (JavaScript/Fetch)**:
```javascript
const getTodayTasks = async () => {
  const response = await fetch('http://localhost:5000/api/tasks/today');
  return response.json();
};

getTodayTasks().then(data => console.log(data));
```

---

### 3. Get Tasks for a Specific Date

**Endpoint**: `GET /tasks/date/:date`

**Description**: Fetch all tasks for a specific date. Format: YYYY-MM-DD

**Path Parameters**:
| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| date | string | ✅ | Format: YYYY-MM-DD |

**Response** (200):
```json
{
  "success": true,
  "date": "2026-04-05",
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Learn Docker Basics",
      "description": "Complete Docker tutorial",
      "category": "Docker",
      "date": "2026-04-05T00:00:00.000Z",
      "status": "completed",
      "priority": "medium",
      "completedAt": "2026-04-05T15:30:00.000Z",
      "linkedFromDate": null,
      "isCarriedOver": false,
      "createdAt": "2026-04-05T09:00:00.000Z",
      "updatedAt": "2026-04-05T15:30:00.000Z"
    }
  ],
  "totalTasks": 3,
  "completedTasks": 1,
  "pendingTasks": 1,
  "incompleteTasks": 1
}
```

**Example (JavaScript/Fetch)**:
```javascript
const getTasksByDate = async (date) => {
  const response = await fetch(`http://localhost:5000/api/tasks/date/${date}`);
  return response.json();
};

getTasksByDate('2026-04-05').then(data => console.log(data));
```

---

### 4. Get Tasks for a Date Range

**Endpoint**: `GET /tasks?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

**Description**: Fetch all tasks within a date range.

**Query Parameters**:
| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| startDate | string | ✅ | Format: YYYY-MM-DD |
| endDate | string | ✅ | Format: YYYY-MM-DD |

**Response** (200):
```json
{
  "success": true,
  "startDate": "2026-03-28",
  "endDate": "2026-04-07",
  "tasks": [
    // Array of tasks
  ],
  "totalTasks": 25,
  "completedTasks": 15,
  "pendingTasks": 8,
  "incompleteTasks": 2
}
```

**Example (JavaScript/Fetch)**:
```javascript
const getTasksByDateRange = async (startDate, endDate) => {
  const response = await fetch(
    `http://localhost:5000/api/tasks?startDate=${startDate}&endDate=${endDate}`
  );
  return response.json();
};

getTasksByDateRange('2026-03-28', '2026-04-07').then(data => console.log(data));
```

---

### 5. Get Incomplete Tasks from Previous Days

**Endpoint**: `GET /tasks/incomplete/previous`

**Description**: Fetch all incomplete and pending tasks from previous days. Use this for the "incomplete task bin".

**Response** (200):
```json
{
  "success": true,
  "message": "Incomplete tasks from previous days",
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Finish Docker Project",
      "description": "Complete the project setup",
      "category": "Docker",
      "date": "2026-04-05T00:00:00.000Z",
      "status": "incomplete",
      "priority": "high",
      "completedAt": null,
      "linkedFromDate": null,
      "isCarriedOver": false,
      "createdAt": "2026-04-05T09:00:00.000Z",
      "updatedAt": "2026-04-06T10:00:00.000Z"
    }
  ],
  "totalIncompleteTasks": 3
}
```

**Example (JavaScript/Fetch)**:
```javascript
const getIncompleteTasksFromPreviousDays = async () => {
  const response = await fetch('http://localhost:5000/api/tasks/incomplete/previous');
  return response.json();
};

getIncompleteTasksFromPreviousDays().then(data => console.log(data));
```

---

### 6. Update a Task

**Endpoint**: `PUT /tasks/:id`

**Description**: Update any fields of a task.

**Path Parameters**:
| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| id | string | ✅ | MongoDB task ID |

**Request Body** (send only fields to update):
```json
{
  "title": "Updated Task Title",
  "status": "pending",
  "priority": "high",
  "description": "Updated description"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Task Title",
    "description": "Updated description",
    "category": "DSA",
    "date": "2026-04-07T00:00:00.000Z",
    "status": "pending",
    "priority": "high",
    "completedAt": null,
    "linkedFromDate": null,
    "isCarriedOver": false,
    "createdAt": "2026-04-07T10:30:00.000Z",
    "updatedAt": "2026-04-07T12:00:00.000Z"
  }
}
```

**Example (JavaScript/Fetch)**:
```javascript
const updateTask = async (taskId, updates) => {
  const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return response.json();
};

updateTask('507f1f77bcf86cd799439011', {
  status: 'pending',
  priority: 'high'
});
```

---

### 7. Mark Task as Complete

**Endpoint**: `PATCH /tasks/:id/complete`

**Description**: Mark a task as completed with the current timestamp.

**Path Parameters**:
| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| id | string | ✅ | MongoDB task ID |

**Response** (200):
```json
{
  "success": true,
  "message": "Task marked as completed",
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete DSA Binary Trees",
    "description": "Study and practice binary tree problems",
    "category": "DSA",
    "date": "2026-04-07T00:00:00.000Z",
    "status": "completed",
    "priority": "high",
    "completedAt": "2026-04-07T14:30:00.000Z",
    "linkedFromDate": null,
    "isCarriedOver": false,
    "createdAt": "2026-04-07T10:30:00.000Z",
    "updatedAt": "2026-04-07T14:30:00.000Z"
  }
}
```

**Example (JavaScript/Fetch)**:
```javascript
const markTaskComplete = async (taskId) => {
  const response = await fetch(
    `http://localhost:5000/api/tasks/${taskId}/complete`,
    { method: 'PATCH' }
  );
  return response.json();
};

markTaskComplete('507f1f77bcf86cd799439011');
```

---

### 8. Delete a Task

**Endpoint**: `DELETE /tasks/:id`

**Description**: Delete a task permanently.

**Path Parameters**:
| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| id | string | ✅ | MongoDB task ID |

**Response** (200):
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Deleted Task",
    "description": "This task was deleted",
    "category": "DSA",
    "date": "2026-04-07T00:00:00.000Z",
    "status": "pending",
    "priority": "high",
    "completedAt": null,
    "linkedFromDate": null,
    "isCarriedOver": false,
    "createdAt": "2026-04-07T10:30:00.000Z",
    "updatedAt": "2026-04-07T10:30:00.000Z"
  }
}
```

**Example (JavaScript/Fetch)**:
```javascript
const deleteTask = async (taskId) => {
  const response = await fetch(
    `http://localhost:5000/api/tasks/${taskId}`,
    { method: 'DELETE' }
  );
  return response.json();
};

deleteTask('507f1f77bcf86cd799439011');
```

---

### 9. Complete All Tasks for a Date

**Endpoint**: `PATCH /tasks/complete-all/:date`

**Description**: Mark all tasks for a specific date as completed.

**Path Parameters**:
| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| date | string | ✅ | Format: YYYY-MM-DD |

**Response** (200):
```json
{
  "success": true,
  "message": "All tasks for 2026-04-07 have been marked as completed",
  "totalTasksCompleted": 5,
  "tasks": [
    // Array of updated tasks
  ]
}
```

**Example (JavaScript/Fetch)**:
```javascript
const completeAllTasksForDate = async (date) => {
  const response = await fetch(
    `http://localhost:5000/api/tasks/complete-all/${date}`,
    { method: 'PATCH' }
  );
  return response.json();
};

completeAllTasksForDate('2026-04-07');
```

---

### 10. Get Last 90 Days Tasks

**Endpoint**: `GET /tasks/last90days`

**Description**: Fetch all tasks from the last 90 days.

**Response** (200):
```json
{
  "success": true,
  "message": "Last 90 days tasks",
  "totalTasks": 150,
  "tasks": [
    // Array of tasks from last 90 days
  ]
}
```

**Example (JavaScript/Fetch)**:
```javascript
const getLast90DaysTasks = async () => {
  const response = await fetch('http://localhost:5000/api/tasks/last90days');
  return response.json();
};

getLast90DaysTasks().then(data => console.log(data));
```

---

### 11. Get Category Statistics (Last 90 Days)

**Endpoint**: `GET /tasks/stats/category`

**Description**: Get completion statistics for each category in the last 90 days.

**Response** (200):
```json
{
  "success": true,
  "message": "Category statistics",
  "categories": [
    {
      "category": "DSA",
      "total": 25,
      "completed": 20,
      "pending": 3,
      "incomplete": 2,
      "completionPercentage": "80.00%"
    },
    {
      "category": "Docker",
      "total": 15,
      "completed": 12,
      "pending": 2,
      "incomplete": 1,
      "completionPercentage": "80.00%"
    },
    {
      "category": "Projects",
      "total": 10,
      "completed": 7,
      "pending": 2,
      "incomplete": 1,
      "completionPercentage": "70.00%"
    }
  ]
}
```

**Example (JavaScript/Fetch)**:
```javascript
const getCategoryStats = async () => {
  const response = await fetch('http://localhost:5000/api/tasks/stats/category');
  return response.json();
};

getCategoryStats().then(data => {
  data.categories.forEach(cat => {
    console.log(`${cat.category}: ${cat.completionPercentage}`);
  });
});
```

---

### 12. Get Progress by Category (All Time)

**Endpoint**: `GET /tasks/stats/progress`

**Description**: Get overall completion percentage by category across all tasks.

**Response** (200):
```json
{
  "success": true,
  "message": "Progress by category",
  "progress": [
    {
      "category": "DSA",
      "completionPercentage": "75.50%",
      "completed": 75,
      "total": 99
    },
    {
      "category": "Docker",
      "completionPercentage": "68.42%",
      "completed": 26,
      "total": 38
    },
    {
      "category": "Problem Solving",
      "completionPercentage": "82.35%",
      "completed": 28,
      "total": 34
    },
    {
      "category": "Projects",
      "completionPercentage": "76.92%",
      "completed": 30,
      "total": 39
    }
  ]
}
```

**Example (JavaScript/Fetch)**:
```javascript
const getProgressByCategory = async () => {
  const response = await fetch('http://localhost:5000/api/tasks/stats/progress');
  return response.json();
};

getProgressByCategory().then(data => {
  data.progress.forEach(cat => {
    console.log(`${cat.category}: ${cat.completionPercentage} (${cat.completed}/${cat.total})`);
  });
});
```

---

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages.

**Common Error Responses**:

### 400 Bad Request
```json
{
  "error": "Title and category are required"
}
```

### 404 Not Found
```json
{
  "error": "Task not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message describing the issue"
}
```

---

## Frontend Implementation Examples

### React Setup

1. **Create a service file** (`taskService.ts`):

```typescript
const BASE_URL = 'http://localhost:5000/api/tasks';

export const taskService = {
  // Create task
  createTask: async (taskData) => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    return response.json();
  },

  // Get today's tasks
  getTodayTasks: async () => {
    const response = await fetch(`${BASE_URL}/today`);
    return response.json();
  },

  // Get tasks by date
  getTasksByDate: async (date) => {
    const response = await fetch(`${BASE_URL}/date/${date}`);
    return response.json();
  },

  // Get tasks by date range
  getTasksByDateRange: async (startDate, endDate) => {
    const response = await fetch(
      `${BASE_URL}?startDate=${startDate}&endDate=${endDate}`
    );
    return response.json();
  },

  // Get incomplete tasks
  getIncompleteTasksFromPreviousDays: async () => {
    const response = await fetch(`${BASE_URL}/incomplete/previous`);
    return response.json();
  },

  // Update task
  updateTask: async (id, updates) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  },

  // Mark task as complete
  markTaskComplete: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}/complete`, {
      method: 'PATCH'
    });
    return response.json();
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  // Get category stats
  getCategoryStats: async () => {
    const response = await fetch(`${BASE_URL}/stats/category`);
    return response.json();
  },

  // Get progress by category
  getProgressByCategory: async () => {
    const response = await fetch(`${BASE_URL}/stats/progress`);
    return response.json();
  }
};
```

2. **Use in a React Component** (`TaskManager.tsx`):

```typescript
import React, { useState, useEffect } from 'react';
import { taskService } from './services/taskService';

export const TaskManager = () => {
  const [todayTasks, setTodayTasks] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = await taskService.getTodayTasks();
        const stats = await taskService.getCategoryStats();
        setTodayTasks(today.tasks);
        setCategoryStats(stats.categories);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      const result = await taskService.createTask(taskData);
      if (result.success) {
        // Refresh tasks
        const updated = await taskService.getTodayTasks();
        setTodayTasks(updated.tasks);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await taskService.markTaskComplete(taskId);
      // Refresh tasks
      const updated = await taskService.getTodayTasks();
      setTodayTasks(updated.tasks);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="task-manager">
      <h1>Task Manager</h1>
      
      {/* Today's Tasks */}
      <section className="today-tasks">
        <h2>Today's Tasks</h2>
        {todayTasks.map(task => (
          <div key={task._id} className="task-card">
            <h3>{task.title}</h3>
            <p>Category: {task.category}</p>
            <p>Priority: {task.priority}</p>
            <p>Status: {task.status}</p>
            {task.status !== 'completed' && (
              <button onClick={() => handleCompleteTask(task._id)}>
                Mark as Complete
              </button>
            )}
          </div>
        ))}
      </section>

      {/* Category Stats */}
      <section className="category-stats">
        <h2>Category Progress</h2>
        {categoryStats.map(stat => (
          <div key={stat.category} className="stat-card">
            <h3>{stat.category}</h3>
            <p>Completion: {stat.completionPercentage}</p>
            <p>Completed: {stat.completed}/{stat.total}</p>
          </div>
        ))}
      </section>
    </div>
  );
};
```

---

## Vue.js Setup

```javascript
// composables/useTaskManager.js
import { ref } from 'vue';

const BASE_URL = 'http://localhost:5000/api/tasks';

export const useTaskManager = () => {
  const todayTasks = ref([]);
  const categoryStats = ref([]);
  const loading = ref(false);

  const getTodayTasks = async () => {
    loading.value = true;
    try {
      const response = await fetch(`${BASE_URL}/today`);
      const data = await response.json();
      todayTasks.value = data.tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      const data = await response.json();
      if (data.success) {
        await getTodayTasks();
      }
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const getCategoryStats = async () => {
    try {
      const response = await fetch(`${BASE_URL}/stats/category`);
      const data = await response.json();
      categoryStats.value = data.categories;
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return {
    todayTasks,
    categoryStats,
    loading,
    getTodayTasks,
    createTask,
    getCategoryStats
  };
};
```

---

## Angular Setup

```typescript
// services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  getTodayTasks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/today`);
  }

  getTasksByDate(date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/date/${date}`);
  }

  createTask(taskData: any): Observable<any> {
    return this.http.post(this.baseUrl, taskData);
  }

  updateTask(id: string, updates: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, updates);
  }

  markTaskComplete(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/complete`, {});
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getCategoryStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/category`);
  }

  getProgressByCategory(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/progress`);
  }
}
```

---

## Frontend Features to Build

### 1. Daily Task View
- Display tasks for today
- Show task status, category, and priority
- Quick actions: Mark complete, Delete, Edit
- Summary cards: Total, Completed, Pending, Incomplete

### 2. Calendar View
- Pick any date to view/manage tasks for that date
- Highlight days with incomplete tasks
- Show date range for custom period queries

### 3. Incomplete Task Bin
- Display all incomplete and pending tasks from previous days
- Option to reschedule or complete them
- Separate section on the dashboard

### 4. Progress Dashboard
- Bar/pie charts showing completion by category
- Overall progress percentage
- Weekly/monthly trends
- Category breakdown with percentages

### 5. Task Management
- Add tasks with category, priority, and date
- Edit existing tasks
- Mark as complete with timestamp
- Delete tasks
- Drag-and-drop to reschedule

### 6. Filters & Search
- Filter by category
- Filter by status (Pending, Completed, Incomplete)
- Filter by priority
- Search by title or description

---

## Environment Variables (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## CORS Configuration

The backend is configured with CORS enabled. If you encounter CORS errors during frontend development, ensure your frontend URL is allowed in the server setup.

---

## Common Use Cases

### Get Today's Tasks and Show Stats
```javascript
async function showTodayDashboard() {
  const response = await fetch('http://localhost:5000/api/tasks/today');
  const data = await response.json();
  
  console.log(`Total Tasks: ${data.totalTasks}`);
  console.log(`Completed: ${data.completedTasks}`);
  console.log(`Pending: ${data.pendingTasks}`);
  console.log(`Incomplete: ${data.incompleteTasks}`);
  
  return data.tasks;
}
```

### Add a Task and Mark it Complete
```javascript
async function quickAddAndComplete(title, category) {
  // Create
  const createRes = await fetch('http://localhost:5000/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, category, priority: 'high' })
  });
  const { task } = await createRes.json();
  
  // Complete immediately
  const completeRes = await fetch(
    `http://localhost:5000/api/tasks/${task._id}/complete`,
    { method: 'PATCH' }
  );
  return completeRes.json();
}
```

### Get Category Progress
```javascript
async function showCategoryProgress() {
  const response = await fetch('http://localhost:5000/api/tasks/stats/progress');
  const data = await response.json();
  
  data.progress.forEach(cat => {
    console.log(`${cat.category}: ${cat.completionPercentage}`);
  });
}
```

---

## Troubleshooting

### CORS Errors
- Ensure backend is running on `http://localhost:5000`
- Check browser console for specific CORS error messages
- Verify Content-Type headers are set correctly

### Date Format Issues
- Always use YYYY-MM-DD format for dates
- JavaScript example: `new Date().toISOString().split('T')[0]`

### Task Not Appearing
- Verify date is correct (check server time)
- Ensure category matches enum values
- Check API response for error messages

---

## Support & Debugging

For API debugging use:
- **Thunder Client**: Visual API testing tool
- **Postman**: Full-featured API testing platform
- **cURL**: Command-line API testing

Example health check:
```bash
curl http://localhost:5000/api/health
```

---

## Summary

This Task Manager API provides a complete backend solution for managing daily tasks with comprehensive tracking, progress analytics, and historical data retention. Use the provided examples to integrate with your frontend framework of choice.

**Happy Task Managing! 🚀**
