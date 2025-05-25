"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"
import { Send, Loader2, AlertCircle, Sparkles, User, RotateCcw, Copy, Check } from "lucide-react"

interface AIAssistantProps {
  darkMode: boolean
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AIAssistant({ darkMode }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai-assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content.trim() }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const assistantMessage = await response.json()
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send message")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = () => {
    sendMessage(inputMessage)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
  }

  const copyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      console.error("Failed to copy message:", error)
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const quickPrompts = [
    "Help me improve this sentence:",
    "Explain the difference between 'affect' and 'effect'",
    "Check this text for grammar errors:",
    "Give me writing tips for better clarity",
    "What's the correct way to use commas?",
    "How can I make my writing more professional?",
  ]

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)]">
      <div
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg shadow-sm border h-full flex flex-col`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Grammar AI Assistant
                </h3>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Powered by Google Gemini • Get instant grammar help
                </p>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"
                }`}
                title="Clear chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                ×
              </button>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"} mb-2`}>
                Welcome to Grammar AI Assistant
              </h3>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6 max-w-md mx-auto`}>
                Ask me anything about grammar, writing, punctuation, or language usage. I'm here to help you write
                better!
              </p>

              {/* Quick Start Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl mx-auto">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(prompt)}
                    className={`p-3 text-sm text-left rounded-lg border transition-colors ${
                      darkMode
                        ? "border-gray-600 hover:bg-gray-700 text-gray-300 hover:border-gray-500"
                        : "border-gray-300 hover:bg-gray-50 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? `${darkMode ? "bg-blue-600" : "bg-blue-500"}`
                        : "bg-gradient-to-br from-purple-500 to-blue-600"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </div>

                  <div className={`flex-1 max-w-3xl ${message.role === "user" ? "text-right" : "text-left"}`}>
                    <div className="group relative">
                      <div
                        className={`inline-block p-4 rounded-lg ${
                          message.role === "user"
                            ? `${darkMode ? "bg-blue-600" : "bg-blue-500"} text-white`
                            : `${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>

                      {/* Copy button for assistant messages */}
                      {message.role === "assistant" && (
                        <button
                          onClick={() => copyMessage(message.content, message.id)}
                          className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                            darkMode ? "hover:bg-gray-600 text-gray-300" : "hover:bg-gray-200 text-gray-600"
                          }`}
                          title="Copy message"
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>

                    <p
                      className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"} mt-1 ${
                        message.role === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex items-start space-x-3 mt-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className={`inline-block p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`p-6 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex space-x-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about grammar, writing tips, or paste text to check..."
              className={`flex-1 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
              rows={3}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"} mt-2`}>
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
