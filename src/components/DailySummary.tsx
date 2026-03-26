import { useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Task, DailyLog } from '../types'
import './DailySummary.css'

interface DailySummaryProps {
  tasks: Task[]
  onClose: () => void
}

export default function DailySummary({ tasks, onClose }: DailySummaryProps) {
  const [, setLogs] = useLocalStorage<DailyLog[]>('dailyLogs', [])

  const today = new Date().toISOString().split('T')[0]

  const completedToday = useMemo(() => {
    return tasks.filter(t => {
      if (!t.completed) return false
      const updated = t.updatedAt.split('T')[0]
      return updated === today
    })
  }, [tasks, today])

  const pendingTasks = useMemo(() => {
    return tasks.filter(t => !t.completed && t.zoneId !== 'done')
  }, [tasks])

  const generateSummary = () => {
    const completed = completedToday.map(t => `- ${t.title}`).join('\n')
    const pending = pendingTasks.map(t => `- ${t.title}`).join('\n')

    return `## 每日总结 - ${today}

### 已完成 (${completedToday.length})
${completed || '无'}

### 待处理 (${pendingTasks.length})
${pending || '无'}

---
生成时间: ${new Date().toLocaleString('zh-CN')}`
  }

  const saveLog = () => {
    const newLog: DailyLog = {
      date: today,
      completedTasks: completedToday.map(t => t.id),
      pendingTasks: pendingTasks.map(t => t.id),
      createdAt: new Date().toISOString(),
    }
    setLogs(prev => [...prev.filter(l => l.date !== today), newLog])
    alert('日志已保存')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateSummary())
    alert('已复制到剪贴板')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content daily-summary" onClick={e => e.stopPropagation()}>
        <h3>每日总结</h3>
        <p className="date">{today}</p>

        <div className="summary-section">
          <h4>已完成 ({completedToday.length})</h4>
          {completedToday.length > 0 ? (
            <ul>
              {completedToday.map(task => (
                <li key={task.id}>{task.title}</li>
              ))}
            </ul>
          ) : (
            <p className="empty">暂无</p>
          )}
        </div>

        <div className="summary-section">
          <h4>待处理 ({pendingTasks.length})</h4>
          {pendingTasks.length > 0 ? (
            <ul>
              {pendingTasks.map(task => (
                <li key={task.id}>{task.title}</li>
              ))}
            </ul>
          ) : (
            <p className="empty">暂无</p>
          )}
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={copyToClipboard}>
            复制
          </button>
          <button className="save-btn" onClick={saveLog}>
            保存日志
          </button>
        </div>
      </div>
    </div>
  )
}
