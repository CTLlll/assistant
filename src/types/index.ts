export type Priority = 'urgent' | 'important' | 'normal'
export type ZoneId = 'today' | 'week' | 'later' | 'done'
export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly'

export interface Task {
  id: string
  title: string
  completed: boolean
  zoneId: ZoneId
  priority: Priority
  dueDate?: string
  dueTime?: string
  recurrence: Recurrence
  createdAt: string
  updatedAt: string
  order: number
}

export interface Zone {
  id: ZoneId
  title: string
  color: string
}

export const ZONES: Zone[] = [
  { id: 'today', title: '今日待办', color: '#FF6B6B' },
  { id: 'week', title: '本周计划', color: '#4ECDC4' },
  { id: 'later', title: '稍后处理', color: '#95A5A6' },
  { id: 'done', title: '已完成', color: '#2ECC71' },
]

export interface AppState {
  tasks: Task[]
  dailyLogs: DailyLog[]
}

export interface DailyLog {
  date: string
  completedTasks: string[]
  pendingTasks: string[]
  createdAt: string
}
