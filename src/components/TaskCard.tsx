import { Task, Zone } from '../types'
import './TaskCard.css'

interface TaskCardProps {
  task: Task
  zone: Zone
  onComplete: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
}

export default function TaskCard({ task, zone, onComplete, onDelete, onEdit, onDragStart }: TaskCardProps) {
  const priorityLabels = {
    urgent: { text: '紧急', color: '#FF6B6B' },
    important: { text: '重要', color: '#FFB84D' },
    normal: { text: '普通', color: '#95A5A6' },
  }

  const priority = priorityLabels[task.priority]

  return (
    <div
      className={`task-card ${task.completed ? 'completed' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      style={{ borderLeftColor: zone.color }}
    >
      <div className="task-main" onClick={() => onComplete(task.id)}>
        <div className="task-checkbox">
          {task.completed ? '✓' : ''}
        </div>
        <div className="task-content">
          <div className="task-title">{task.title}</div>
          <div className="task-meta">
            {task.dueDate && (
              <span className="task-due-date">
                {task.dueDate}
                {task.dueTime && ` ${task.dueTime}`}
              </span>
            )}
            {task.recurrence !== 'none' && (
              <span className="task-recurrence">⟳</span>
            )}
          </div>
        </div>
      </div>
      <div className="task-actions">
        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(task)
          }}
          title="编辑"
        >
          ✎
        </button>
        <span
          className="priority-tag"
          style={{ backgroundColor: priority.color }}
        >
          {priority.text}
        </span>
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task.id)
          }}
          title="删除"
        >
          ×
        </button>
      </div>
    </div>
  )
}
