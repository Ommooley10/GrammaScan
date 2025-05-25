import type { GrammarResult, ChatMessage, ChatSession } from "./types"

export const checkGrammar = async (text: string): Promise<GrammarResult> => {
  const response = await fetch("https://gramma-backend.onrender.com/check_grammar/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

// AI Assistant API Functions (Updated for Gemini)
export const sendChatMessage = async (message: string, sessionId?: string): Promise<ChatMessage> => {
  const response = await fetch("/api/ai-assistant/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      sessionId,
      context: "grammar_assistant", // Specify this is a grammar-focused AI
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

export const createChatSession = async (title?: string): Promise<string> => {
  const response = await fetch("/api/ai-assistant/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: title || "New Chat" }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data.sessionId
}

export const getChatSessions = async (): Promise<ChatSession[]> => {
  const response = await fetch("/api/ai-assistant/sessions")

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

export const deleteChatSession = async (sessionId: string): Promise<void> => {
  const response = await fetch(`/api/ai-assistant/sessions/${sessionId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
}

// AI-powered grammar suggestions using Gemini
export const getGrammarSuggestions = async (text: string): Promise<string[]> => {
  const response = await fetch("/api/ai-assistant/grammar-suggestions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data.suggestions
}
