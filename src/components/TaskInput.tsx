import { useState, KeyboardEvent } from 'react'
import VoiceInput from './VoiceInput'
import './TaskInput.css'

interface TaskInputProps {
  onAddTasks: (titles: string[]) => void
}

export default function TaskInput({ onAddTasks }: TaskInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = () => {
    if (!input.trim()) return
    
    const titles = input
      .split(/[,，、;；\n]/)
      .map(t => t.trim())
      .filter(t => t.length > 0)
    
    if (titles.length > 0) {
      onAddTasks(titles)
      setInput('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleVoiceTranscript = (text: string) => {
    setInput(text)
  }

  return (
    <div className="task-input-wrapper">
      <div className="task-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入任务，用空格/逗号/换行分隔多个任务..."
          rows={2}
        />
        <button onClick={handleSubmit} disabled={!input.trim()}>
          添加任务
        </button>
      </div>
      <VoiceInput onTranscript={handleVoiceTranscript} />
    </div>
  )
}
