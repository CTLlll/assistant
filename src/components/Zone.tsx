import { Task, Zone as ZoneType } from '../types'
import TaskCard from './TaskCard'
import './Zone.css'

interface ZoneProps {
  zone: ZoneType
  tasks: Task[]
  onCompleteTask: (id: string) => void
  onDeleteTask: (id: string) => void
  onDropTask: (taskId: string, zoneId: import('../types').ZoneId) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onEditTask: (task: Task) => void
}

export default function Zone({
  zone,
  tasks,
  onCompleteTask,
  onDeleteTask,
  onDropTask,
  onDragStart,
  onEditTask,
}: ZoneProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) {
      onDropTask(taskId, zone.id)
    }
  }

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order)

  return (
    <div
      className="zone"
      data-zone={zone.id}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="zone-header" style={{ borderBottomColor: zone.color }}>
        <h2>{zone.title}</h2>
        <span className="zone-count">{tasks.length}</span>
      </div>
      <div className="zone-tasks">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            zone={zone}
            onComplete={onCompleteTask}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
            onDragStart={onDragStart}
          />
        ))}
        {tasks.length === 0 && (
          <div className="zone-empty">
            {zone.id === 'done' ? '暂无已完成任务' : '暂无任务'}
          </div>
        )}
      </div>
    </div>
  )
}
