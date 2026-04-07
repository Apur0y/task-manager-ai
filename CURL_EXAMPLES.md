# Task Manager API - cURL Examples

This file contains ready-to-use cURL commands for testing all API endpoints.

## Base URL
```
http://localhost:5000/api/tasks
```

---

## 1. CREATE TASK

### Create a basic task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete DSA Binary Trees",
    "category": "DSA",
    "priority": "high"
  }'
```

### Create task with description and specific date
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Setup Docker on Project",
    "description": "Configure Docker containers for the project",
    "category": "Docker",
    "date": "2026-04-07",
    "priority": "high"
  }'
```

### Create multiple tasks
```bash
# Task 1: DSA
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Array Problems","category":"DSA","priority":"high"}'

# Task 2: Docker
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Docker Compose","category":"Docker","priority":"medium"}'

# Task 3: Projects
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Deploy to production","category":"Projects","priority":"high"}'

# Task 4: Learning
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Study Rest APIs","category":"Learning","priority":"low"}'
```

---

## 2. GET TODAY'S TASKS

```bash
curl http://localhost:5000/api/tasks/today
```

**Pretty formatted:**
```bash
curl -s http://localhost:5000/api/tasks/today | jq '.'
```

---

## 3. GET TASKS FOR SPECIFIC DATE

### Get tasks for April 5, 2026
```bash
curl http://localhost:5000/api/tasks/date/2026-04-05
```

### Get tasks for April 7, 2026
```bash
curl http://localhost:5000/api/tasks/date/2026-04-07
```

---

## 4. GET TASKS FOR DATE RANGE

### Get tasks from April 1 to April 7, 2026
```bash
curl "http://localhost:5000/api/tasks?startDate=2026-04-01&endDate=2026-04-07"
```

### Get entire week
```bash
curl "http://localhost:5000/api/tasks?startDate=2026-04-07&endDate=2026-04-13"
```

### Get last 30 days (if within 90-day window)
```bash
curl "http://localhost:5000/api/tasks?startDate=2026-03-08&endDate=2026-04-07"
```

---

## 5. GET INCOMPLETE TASKS FROM PREVIOUS DAYS

```bash
curl http://localhost:5000/api/tasks/incomplete/previous
```

**Save to file:**
```bash
curl http://localhost:5000/api/tasks/incomplete/previous > incomplete_tasks.json
```

---

## 6. GET LAST 90 DAYS TASKS

```bash
curl http://localhost:5000/api/tasks/last90days
```

**Count total tasks:**
```bash
curl -s http://localhost:5000/api/tasks/last90days | jq '.totalTasks'
```

---

## 7. UPDATE TASK

### Update task title and priority (replace TASK_ID with actual ID)
```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "priority": "medium"
  }'
```

### Change task category
```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"category": "Projects"}'
```

### Reschedule task to different date
```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-04-10"}'
```

### Mark as incomplete (without deleting)
```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "incomplete"}'
```

---

## 8. MARK TASK AS COMPLETE

```bash
curl -X PATCH http://localhost:5000/api/tasks/TASK_ID/complete
```

**Multiple tasks in sequence:**
```bash
# Replace TASK_ID_1, TASK_ID_2, etc. with actual IDs
curl -X PATCH http://localhost:5000/api/tasks/TASK_ID_1/complete
curl -X PATCH http://localhost:5000/api/tasks/TASK_ID_2/complete
curl -X PATCH http://localhost:5000/api/tasks/TASK_ID_3/complete
```

---

## 9. DELETE TASK

```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID
```

**Delete multiple tasks:**
```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID_1
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID_2
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID_3
```

---

## 10. COMPLETE ALL TASKS FOR A DATE

### Complete all tasks for today
```bash
curl -X PATCH http://localhost:5000/api/tasks/complete-all/2026-04-07
```

### Complete all tasks for a specific date
```bash
curl -X PATCH http://localhost:5000/api/tasks/complete-all/2026-04-05
```

---

## 11. GET CATEGORY STATISTICS (LAST 90 DAYS)

```bash
curl http://localhost:5000/api/tasks/stats/category
```

**Pretty formatted:**
```bash
curl -s http://localhost:5000/api/tasks/stats/category | jq '.categories[] | {category: .category, percentage: .completionPercentage}'
```

**Get just percentages:**
```bash
curl -s http://localhost:5000/api/tasks/stats/category | jq '.categories[] | "\(.category): \(.completionPercentage)"'
```

---

## 12. GET PROGRESS BY CATEGORY (ALL TIME)

```bash
curl http://localhost:5000/api/tasks/stats/progress
```

**Format as table:**
```bash
curl -s http://localhost:5000/api/tasks/stats/progress | jq -r '.progress[] | "\(.category): \(.completionPercentage) (\(.completed)/\(.total))"'
```

---

## HEALTH CHECK

```bash
curl http://localhost:5000/api/health
```

---

## WORKFLOW EXAMPLES

### Daily Workflow

```bash
# 1. Check today's tasks
curl http://localhost:5000/api/tasks/today

# 2. Add a new task
TASK_RESPONSE=$(curl -s -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Morning standup","category":"Learning","priority":"high"}')
TASK_ID=$(echo $TASK_RESPONSE | jq -r '.task._id')

# 3. Check tasks again
curl http://localhost:5000/api/tasks/today

# 4. Complete the task
curl -X PATCH http://localhost:5000/api/tasks/$TASK_ID/complete

# 5. Check incomplete from previous days
curl http://localhost:5000/api/tasks/incomplete/previous

# 6. Check progress
curl http://localhost:5000/api/tasks/stats/progress
```

### Weekly Review Workflow

```bash
# 1. Get last week's tasks
curl "http://localhost:5000/api/tasks?startDate=2026-04-01&endDate=2026-04-07"

# 2. Get statistics for category
curl http://localhost:5000/api/tasks/stats/category

# 3. View incomplete tasks
curl http://localhost:5000/api/tasks/incomplete/previous

# 4. Complete all pending if desired
curl -X PATCH http://localhost:5000/api/tasks/complete-all/2026-04-07
```

### Add Multiple Tasks at Once

```bash
#!/bin/bash
# Save as add_tasks.sh and run: bash add_tasks.sh

TASKS=(
  '{"title":"DSA: Linked Lists","category":"DSA","priority":"high"}'
  '{"title":"Docker: Build image","category":"Docker","priority":"medium"}'
  '{"title":"Code review PR #123","category":"Code Review","priority":"high"}'
  '{"title":"Fix bug in login","category":"Problem Solving","priority":"high"}'
  '{"title":"Learn TypeScript","category":"Learning","priority":"low"}'
)

for task in "${TASKS[@]}"; do
  curl -X POST http://localhost:5000/api/tasks \
    -H "Content-Type: application/json" \
    -d "$task"
  echo "Task created"
done

# Show all today's tasks
echo "All today's tasks:"
curl http://localhost:5000/api/tasks/today | jq '.tasks[] | {title: .title, category: .category}'
```

---

## PIPING & PROCESSING EXAMPLES

### Get all task titles for today
```bash
curl -s http://localhost:5000/api/tasks/today | jq '.tasks[] | .title'
```

### Count tasks by status
```bash
curl -s http://localhost:5000/api/tasks/today | jq -r '.tasks[] | .status' | sort | uniq -c
```

### Get high priority pending tasks
```bash
curl -s http://localhost:5000/api/tasks/today | jq '.tasks[] | select(.priority == "high" and .status == "pending")'
```

### Export tasks to CSV
```bash
curl -s http://localhost:5000/api/tasks/today | jq -r '.tasks[] | [.title, .category, .priority, .status] | @csv' > tasks.csv
```

---

## WITH VARIABLES

### Create task with variable
```bash
TITLE="My Task"
CATEGORY="DSA"
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"$TITLE\",\"category\":\"$CATEGORY\"}"
```

### Loop through task IDs
```bash
for id in "TASK_ID_1" "TASK_ID_2" "TASK_ID_3"; do
  curl -X PATCH http://localhost:5000/api/tasks/$id/complete
done
```

---

## SAVING RESPONSES

### Save today's tasks to file
```bash
curl http://localhost:5000/api/tasks/today > today_tasks.json
```

### Save with timestamp
```bash
curl http://localhost:5000/api/tasks/today > tasks_$(date +%Y%m%d_%H%M%S).json
```

### Append to file
```bash
curl http://localhost:5000/api/tasks/today >> all_tasks.json
```

---

## FORMATTED OUTPUT

### Pretty print JSON
```bash
curl -s http://localhost:5000/api/tasks/today | jq '.'
```

### Compact output
```bash
curl -s http://localhost:5000/api/tasks/today | jq -c '.'
```

### Custom formatting
```bash
curl -s http://localhost:5000/api/tasks/today | jq '.tasks[] | "\(.title) [\(.category)] - \(.priority) priority"'
```

---

## ERROR HANDLING

### Check HTTP status
```bash
curl -w "\nStatus: %{http_code}\n" http://localhost:5000/api/tasks/today
```

### Silent mode with error details
```bash
curl -s -w "\nStatus: %{http_code}\n" http://localhost:5000/api/tasks/invalid_date/2026-13-01
```

### Verbose output
```bash
curl -v http://localhost:5000/api/tasks/today
```

---

## TIMING REQUESTS

### See request time
```bash
curl -w "@curl-format.txt" http://localhost:5000/api/tasks/today
```

Or use:
```bash
curl -w "Time: %{time_total}\n" http://localhost:5000/api/tasks/today
```

---

## NOTES FOR TESTING

1. **Replace TASK_ID** with actual MongoDB ObjectId from create response
2. **Date Format**: Always use YYYY-MM-DD
3. **Categories**: DSA, Docker, Problem Solving, Projects, Learning, Code Review, Other
4. **Priorities**: low, medium, high
5. **Status**: pending, completed, incomplete
6. **jq required** for JSON formatting (install: `brew install jq` or `apt-get install jq`)

---

## QUICK TEST SEQUENCE

Run these commands in order to test the entire API:

```bash
# 1. Health check
echo "=== Health Check ==="
curl http://localhost:5000/api/health
echo -e "\n"

# 2. Create a task
echo "=== Create Task ==="
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","category":"DSA","priority":"high"}'
echo -e "\n"

# 3. Get today's tasks
echo "=== Get Today Tasks ==="
curl http://localhost:5000/api/tasks/today
echo -e "\n"

# 4. Get statistics
echo "=== Get Statistics ==="
curl http://localhost:5000/api/tasks/stats/progress
echo -e "\n"

echo "✅ API Test Complete"
```

Save as `test_api.sh` and run:
```bash
bash test_api.sh
```

---

**Happy Testing! 🚀**
