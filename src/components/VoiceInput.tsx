import { useState, useEffect } from 'react'
import './VoiceInput.css'

interface VoiceInputProps {
  onTranscript: (text: string) => void
}

export default function VoiceInput({ onTranscript }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setError('您的浏览器不支持语音识别')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'zh-CN'

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setError(`识别错误: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      if (isListening) {
        recognition.start()
      } else {
        setIsListening(false)
      }
    }

    if (isListening) {
      try {
        recognition.start()
      } catch (e) {
        console.error('Recognition start error:', e)
      }
    }

    return () => {
      recognition.stop()
    }
  }, [isListening])

  const handleToggle = () => {
    setError(null)
    setIsListening(!isListening)
  }

  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscript(transcript.trim())
      setTranscript('')
    }
  }

  return (
    <div className="voice-input">
      <button
        className={`voice-btn ${isListening ? 'listening' : ''}`}
        onClick={handleToggle}
        title={isListening ? '停止录音' : '开始录音'}
      >
        {isListening ? '🔴' : '🎤'}
      </button>
      {transcript && (
        <div className="voice-preview">
          <span>{transcript}</span>
          <button onClick={handleSubmit}>添加</button>
        </div>
      )}
      {error && <span className="voice-error">{error}</span>}
    </div>
  )
}
