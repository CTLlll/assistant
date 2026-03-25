import { useState } from 'react'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])

  return (
    <div className="app">
      <header className="header">
        <h1>AI智能任务助手</h1>
      </header>
      <main className="main">
        <div className="zones">
          <Zone title="今日待办" zoneId="today" tasks={tasks} />
          <Zone title="本周计划" zoneId="week" tasks={tasks} />
          <Zone title="稍后处理" zoneId="later" tasks={tasks} />
          <Zone title="已完成" zoneId="done" tasks={tasks} />
        </div>
      </main>
    </div>
  )
}

interface Task {
  id: string
  title: string
  completed: boolean
  zoneId: string
  priority: 'urgent' | 'important' | 'normal'
  dueDate?: Date
  createdAt: Date
}

function Zone({ title, zoneId, tasks }: { title: string; zoneId: string; tasks: Task[] }) {
  return (
    <div className="zone" data-zone={zoneId}>
      <h2>{title}</h2>
    </div>
  )
}

export default App
