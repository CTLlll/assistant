import { useState } from 'react'
import { Task, Priority, Recurrence } from '../types'
import './TaskEditModal.css'

interface TaskEditModalProps {
  task: Task
  onSave: (updates: Partial<Task>) => void
  onClose: () => void
}

export default function TaskEditModal({ task, onSave, onClose }: TaskEditModalProps) {
  const [title, setTitle] = useState(task.title)
  const [priority, setPriority] = useState<Priority>(task.priority)
  const [dueDate, setDueDate] = useState(task.dueDate || '')
  const [dueTime, setDueTime] = useState(task.dueTime || '')
  const [recurrence, setRecurrence] = useState<Recurrence>(task.recurrence)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title: title.trim() || task.title,
      priority,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      recurrence,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>编辑任务</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>任务标题</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="任务名称"
            />
          </div>

          <div className="form-group">
            <label>优先级</label>
            <div className="priority-options">
              {(['urgent', 'important', 'normal'] as Priority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  className={`priority-btn ${priority === p ? 'active' : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {p === 'urgent' ? '紧急' : p === 'important' ? '重要' : '普通'}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>截止日期</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>截止时间</label>
            <input
              type="time"
              value={dueTime}
              onChange={e => setDueTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>重复</label>
            <div className="recurrence-options">
              {(['none', 'daily', 'weekly', 'monthly'] as Recurrence[]).map(r => (
                <button
                  key={r}
                  type="button"
                  className={`recurrence-btn ${recurrence === r ? 'active' : ''}`}
                  onClick={() => setRecurrence(r)}
                >
                  {r === 'none' ? '不重复' : r === 'daily' ? '每日' : r === 'weekly' ? '每周' : '每月'}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="save-btn">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
