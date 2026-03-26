import { useCallback, useState } from 'react'
import TaskInput from './components/TaskInput'
import Zone from './components/Zone'
import TaskEditModal from './components/TaskEditModal'
import DailySummary from './components/DailySummary'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Task, ZONES, ZoneId } from './types'
import './App.css'

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', [])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showSummary, setShowSummary] = useState(false)

  const generateId = () => `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  const addTasks = useCallback((titles: string[]) => {
    const newTasks: Task[] = titles.map((title, index) => {
      const now = new Date().toISOString()
      return {
        id: generateId(),
        title,
        completed: false,
        zoneId: 'today' as ZoneId,
        priority: 'normal' as const,
        recurrence: 'none' as const,
        createdAt: now,
        updatedAt: now,
        order: Date.now() + index,
      }
    })
    setTasks(prev => [...prev, ...newTasks])
  }, [setTasks])

  const completeTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed
        return {
          ...task,
          completed: newCompleted,
          zoneId: newCompleted ? 'done' : task.zoneId === 'done' ? 'today' : task.zoneId,
          updatedAt: new Date().toISOString()
        }
      }
      return task
    }))
  }, [setTasks])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }, [setTasks])

  const moveTask = useCallback((taskId: string, newZoneId: ZoneId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          zoneId: newZoneId,
          updatedAt: new Date().toISOString()
        }
      }
      return task
    }))
  }, [setTasks])

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, ...updates, updatedAt: new Date().toISOString() }
      }
      return task
    }))
  }, [setTasks])

  return (
    <div className="app">
      <header className="header">
        <h1>AI智能任务助手</h1>
        <p className="subtitle">智能管理您的一天</p>
        <button className="summary-btn" onClick={() => setShowSummary(true)}>
          每日总结
        </button>
      </header>
      
      <TaskInput onAddTasks={addTasks} />
      
      <main className="main">
        <div className="zones">
          {ZONES.map(zone => (
            <Zone
              key={zone.id}
              zone={zone}
              tasks={tasks.filter(t => t.zoneId === zone.id)}
              onCompleteTask={completeTask}
              onDeleteTask={deleteTask}
              onDropTask={moveTask}
              onDragStart={handleDragStart}
              onEditTask={setEditingTask}
            />
          ))}
        </div>
      </main>

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onSave={(updates) => updateTask(editingTask.id, updates)}
          onClose={() => setEditingTask(null)}
        />
      )}

      {showSummary && (
        <DailySummary
          tasks={tasks}
          onClose={() => setShowSummary(false)}
        />
      )}
    </div>
  )
}

export default App
