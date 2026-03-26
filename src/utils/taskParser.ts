import { Task, ZoneId } from '../types'

export function parseTasks(input: string): string[] {
  if (!input.trim()) return []

  const tasks: string[] = []
  
  const normalized = input
    .replace(/[,，]/g, '|')
    .replace(/[;；]/g, '|')
    .replace(/\n/g, '|')
    .replace(/、/g, '|')

  const parts = normalized.split('|').filter(p => p.trim())
  
  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed) {
      tasks.push(trimmed)
    }
  }

  return tasks
}

export function createTask(title: string, zoneId: ZoneId = 'today'): Task {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title,
    completed: false,
    zoneId,
    priority: 'normal',
    recurrence: 'none',
    createdAt: now,
    updatedAt: now,
    order: Date.now(),
  }
}

function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export function parseDateFromText(text: string): { dueDate?: string; dueTime?: string; remainingText: string } {
  let remainingText = text
  let dueDate: string | undefined
  let dueTime: string | undefined

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  if (/\d{4}-\d{2}-\d{2}/.test(text)) {
    const match = text.match(/(\d{4}-\d{2}-\d{2})/)
    if (match) {
      dueDate = match[1]
      remainingText = remainingText.replace(match[1], '').trim()
    }
  } else if (/(今天|今日)/.test(text)) {
    dueDate = todayStr
    remainingText = remainingText.replace(/(今天|今日)/, '').trim()
  } else if (/(明天|明日)/.test(text)) {
    dueDate = tomorrowStr
    remainingText = remainingText.replace(/(明天|明日)/, '').trim()
  } else if (/(本周|这周)/.test(text)) {
    dueDate = 'week'
    remainingText = remainingText.replace(/(本周|这周)/, '').trim()
  }

  if (/(\d{1,2}):(\d{2})/.test(text)) {
    const match = text.match(/(\d{1,2}):(\d{2})/)
    if (match) {
      dueTime = match[1].padStart(2, '0') + ':' + match[2]
      remainingText = remainingText.replace(match[0], '').trim()
    }
  }

  return { dueDate, dueTime, remainingText: remainingText.trim() }
}
