'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Message {
  _id: string
  text: string
  createdAt: string
  readAt?: string
  senderId: { _id: string; name: string; role: string }
}

export default function ChatWindow({
  matchId,
  currentUserId,
}: {
  matchId: string
  currentUserId: string
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastTimestampRef = useRef<string | null>(null)

  const fetchMessages = useCallback(async () => {
    const url = lastTimestampRef.current
      ? `/api/chat/${matchId}/messages?after=${encodeURIComponent(lastTimestampRef.current)}`
      : `/api/chat/${matchId}/messages`

    const res = await fetch(url)
    if (!res.ok) return

    const data = await res.json()
    if (data.messages?.length > 0) {
      setMessages((prev) => {
        const ids = new Set(prev.map((m) => m._id))
        const newOnes = data.messages.filter((m: Message) => !ids.has(m._id))
        if (newOnes.length === 0) return prev
        lastTimestampRef.current = newOnes[newOnes.length - 1].createdAt
        return [...prev, ...newOnes]
      })
    }
  }, [matchId])

  // Initial load
  useEffect(() => {
    fetchMessages()
    // Mark as read
    fetch(`/api/chat/${matchId}/read`, { method: 'POST' })
  }, [matchId, fetchMessages])

  // Poll every 3 seconds
  useEffect(() => {
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [fetchMessages])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)

    const res = await fetch(`/api/chat/${matchId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim() }),
    })

    if (res.ok) {
      const data = await res.json()
      setMessages((prev) => [...prev, data.message])
      lastTimestampRef.current = data.message.createdAt
      setText('')
    }
    setSending(false)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">
            No messages yet. Say hello!
          </p>
        )}
        {messages.map((msg) => {
          const isMine = msg.senderId._id === currentUserId ||
                         (msg.senderId as unknown as string) === currentUserId
          return (
            <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs rounded-2xl px-4 py-2 text-sm lg:max-w-md ${
                isMine
                  ? 'rounded-br-sm bg-teal-700 text-white'
                  : 'rounded-bl-sm bg-gray-100 text-gray-800'
              }`}>
                {!isMine && (
                  <p className="mb-1 text-xs font-medium text-gray-500">
                    {msg.senderId.name}
                  </p>
                )}
                <p>{msg.text}</p>
                <p className={`mt-1 text-xs ${isMine ? 'text-teal-200' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex items-center gap-2 border-t p-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-teal-700 focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
