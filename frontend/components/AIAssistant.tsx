"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"
import {
  Send,
  Loader2,
  AlertCircle,
  Sparkles,
  User,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react"
import type { ChatMessage } from "@/lib/types"

interface AIAssistantProps {
  darkMode: boolean
}

export default function AIAssistant({ darkMode }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
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

    const userMessage: ChatMessage = {
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

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()

      // Convert timestamp string to Date object
      const assistantMessage: ChatMessage = {
        ...data,
        timestamp: new Date(data.timestamp),
      }

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
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const quickPrompts = [
    "Help me improve this sentence:",
    "Explain the difference between &apos;affect&apos; and &apos;effect&apos;",
    "Check this text for grammar errors:",
    "Give me writing tips for better clarity",
    "What&apos;s the correct way to use commas?",
    "How can I make my writing more professional?",
  ]

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)]">
      <div
        className={`${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } rounded-lg shadow-sm border h-full flex flex-col`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Grammar AI Assistant
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Powered by Google Gemini &bull; Get instant grammar help
                </p>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
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
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3
                className={`text-lg font-medium ${
                  darkMode ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Welcome to Grammar AI Assistant
              </h3>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } mb-6 max-w-md mx-auto`}
              >
                Ask me anything about grammar, writing, punctuation, or language
                usage. I&apos;m here to help you write better!
              </p>

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
                    message.role === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? darkMode
                          ? "bg-blue-600"
                          : "bg-blue-500"
                        : "bg-gradient-to-br from-purple-500 to-blue-600"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`flex-1 max-w-3xl ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div className="group relative">
                      <div
                        className={`inline-block p-4 rounded-lg ${
                          message.role === "user"
                            ? darkMode
                              ? "bg-blue-600 text-white"
                              : "bg-blue-500 text-white"
                            : darkMode
                            ? "bg-gray-700 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>

                      {/* Timestamp & Copy */}
                      <div
                        className={`absolute bottom-0 ${
                          message.role === "user"
                            ? "-left-6"
                            : "-right-6"
                        } flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity`}
                      >
                        <span
                          className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          } select-none`}
                        >
                          {formatTimestamp(message.timestamp)}
                        </span>
                        <button
                          onClick={() =>
                            copyMessage(message.content, message.id)
                          }
                          title="Copy message"
                          className={`p-1 rounded hover:bg-gray-200 ${
                            darkMode ? "hover:bg-gray-600" : ""
                          }`}
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div
          className={`p-4 border-t flex items-center space-x-4 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <textarea
            rows={1}
            className={`flex-grow resize-none rounded-md border p-2 text-sm focus:outline-none focus:ring-2 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            }`}
            placeholder="Ask me anything..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className={`p-2 rounded-md transition-colors ${
              isLoading || !inputMessage.trim()
                ? "cursor-not-allowed opacity-50"
                : darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            aria-label="Send message"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send />}
          </button>
        </div>
      </div>
    </div>
  )
}
