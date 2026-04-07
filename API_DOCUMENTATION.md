# Task Manager API Documentation

## API Overview

Complete REST API for a task management system with support for:
- Daily task management and planning
- Task categorization and priority levels
- Progress tracking and analytics
- 90-day historical data
- Incomplete task carryover management

## Authentication

Currently, the API does **not require authentication**. All endpoints are publicly accessible.

> **Note**: For production, implement JWT or OAuth2 authentication.

---

## API Endpoints Summary

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|------------|
| `POST` | `/api/tasks` | Create a new task | 201 |
| `GET` | `/api/tasks/today` | Get today's tasks | 200 |
| `GET` | `/api/tasks/date/:date` | Get tasks for specific date | 200 |
| `GET` | `/api/tasks` | Get tasks by date range | 200 |
| `GET` | `/api/tasks/incomplete/previous` | Get incomplete tasks from previous days | 200 |
| `GET` | `/api/tasks/last90days` | Get tasks from last 90 days | 200 |
| `GET` | `/api/tasks/stats/category` | Get category statistics | 200 |
| `GET` | `/api/tasks/stats/progress` | Get progress by category | 200 |
| `PUT` | `/api/tasks/:id` | Update a task | 200 |
| `PATCH` | `/api/tasks/:id/complete` | Mark task as complete | 200 |
| `PATCH` | `/api/tasks/complete-all/:date` | Mark all tasks as complete for date | 200 |
| `DELETE` | `/api/tasks/:id` | Delete a task | 200 |

---

## Request/Response Format

### Request Headers
```
Content-Type: application/json
```

### Response Format
All responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation description",
  "data": {} // Operation-specific data
}
```

**Error Response:**
```json
{
  "error": "Error description"
}
```

---

## Field Specifications

### Task Object

```json
{
  "_id": "MongoDB ObjectId",
  "title": "Task title (string, required)",
  "description": "Task description (string, optional)",
  "category": "Task category (enum)",
  "date": "Task date (ISO 8601 string)",
  "status": "Task status (enum)",
  "priority": "Task priority (enum)",
  "completedAt": "Completion timestamp (ISO 8601 string or null)",
  "linkedFromDate": "Original date if carried over (ISO 8601 string or null)",
  "isCarriedOver": "Whether task was carried from previous day (boolean)",
  "createdAt": "Creation timestamp (ISO 8601 string)",
  "updatedAt": "Last update timestamp (ISO 8601 string)"
}
```

### Enums

**Category:**
- `DSA`
- `Docker`
- `Problem Solving`
- `Projects`
- `Learning`
- `Code Review`
- `Other`

**Status:**
- `pending` - Task is pending
- `completed` - Task is completed
- `incomplete` - Task is incomplete and should be carried forward

**Priority:**
- `low`
- `medium`
- `high`

---

## Rate Limiting

No rate limiting is currently implemented. For production, implement:
```
- 1000 requests per hour per IP
- 100 requests per minute per endpoint
```

---

## Pagination

Endpoints returning multiple tasks may be paginated in future versions using query parameters:
```
?page=1&limit=20
```

---

## Filtering

Future filtering capabilities:
```
?category=DSA&status=pending&priority=high
```

---

## Database Schema

```typescript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  category: String (required, enum),
  date: Date (required, indexed),
  status: String (required, enum),
  priority: String,
  completedAt: Date,
  linkedFromDate: Date,
  isCarriedOver: Boolean,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { date: 1, category: 1 }
- { date: 1, status: 1 }
```

---

## Error Codes

| Code | Message | Solution |
|------|---------|----------|
| `400` | Bad Request | Check request parameters and body |
| `400` | Title and category are required | Include both title and category in request |
| `400` | Date is required (YYYY-MM-DD) | Use valid date format |
| `404` | Task not found | Verify task ID exists |
| `500` | Internal Server Error | Check server logs |

---

## Example Workflows

### Workflow 1: Daily Task Management

```
1. GET /api/tasks/today
   └─ Display today's tasks

2. POST /api/tasks
   └─ Add new task for today

3. PATCH /api/tasks/:id/complete
   └─ Mark task as complete

4. GET /api/tasks/incomplete/previous
   └─ Check incomplete tasks from previous days
```

### Workflow 2: Task Scheduling

```
1. POST /api/tasks
   └─ Create task with specific date

2. GET /api/tasks/date/:date
   └─ View tasks for that date

3. PUT /api/tasks/:id
   └─ Update task (change date, priority, category)

4. DELETE /api/tasks/:id
   └─ Delete if needed
```

### Workflow 3: Progress Analysis

```
1. GET /api/tasks/stats/category
   └─ See last 90 days category stats

2. GET /api/tasks/stats/progress
   └─ See all-time progress by category

3. GET /api/tasks/date/:date
   └─ Analyze specific day performance
```

---

## Data Retention

- **Active Tasks**: Maintained indefinitely
- **Historical Data**: 90 days of full history
- **Deleted Tasks**: Permanently removed from database
- **Archive**: Consider implementing archival for older data

---

## Performance Considerations

- Responses are sorted by date (DESC) and priority (DESC)
- Database indexes on `date` and `status` for faster queries
- Consider caching for stats endpoints (implement Redis for high traffic)

---

## Future Enhancement

- User authentication and authorization
- Task reminders and notifications
- Recurring tasks
- Subtasks and dependencies
- Real-time updates with WebSockets
- File attachments to tasks
- Comments and collaboration
- Custom categories per user
- Analytics dashboards

---

## Development Setup

### Prerequisites
- Node.js 14+
- MongoDB 4.4+
- npm or yarn

### Installation
```bash
npm install
```

### Environment Variables
```
MONGO_URI=mongodb://localhost:27017/task-manager
PORT=5000
NODE_ENV=development
```

### Running
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Testing
```bash
npm test
```

---

## Support

For issues or questions:
1. Check this documentation
2. Review API response error messages
3. Check browser console for details
4. Enable server logging for debugging

---

Generated: April 2026
Version: 1.0.0
