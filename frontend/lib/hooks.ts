"use client"

import { useState, useEffect, useCallback } from "react"
import type { GrammarResult, Stats, ChatMessage, ChatSession, AIAssistantState } from "./types"
import { sendChatMessage, createChatSession, getChatSessions } from "./api"

export const useGrammarStats = (grammarHistory: GrammarResult[]) => {
  const [stats, setStats] = useState<Stats>({
    totalChecks: 0,
    grammarScore: 100,
    improvement: 0,
    streak: 0,
  })

  const calculateStreak = useCallback((history: GrammarResult[]): number => {
    let streak = 0
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].is_grammatically_correct) {
        streak++
      } else {
        break
      }
    }
    return streak
  }, [])

  const updateStats = useCallback(
    (history: GrammarResult[]) => {
      const totalChecks = history.length
      const correctChecks = history.filter((r) => r.is_grammatically_correct).length
      const grammarScore = totalChecks > 0 ? Math.round((correctChecks / totalChecks) * 100) : 100

      let improvement = 0
      if (totalChecks >= 20) {
        const firstTen = history.slice(0, 10)
        const lastTen = history.slice(-10)
        const firstScore = (firstTen.filter((r) => r.is_grammatically_correct).length / 10) * 100
        const lastScore = (lastTen.filter((r) => r.is_grammatically_correct).length / 10) * 100
        improvement = Math.round(lastScore - firstScore)
      }

      setStats({
        totalChecks,
        grammarScore,
        improvement,
        streak: calculateStreak(history),
      })
    },
    [calculateStreak],
  )

  useEffect(() => {
    updateStats(grammarHistory)
  }, [grammarHistory, updateStats])

  return { stats, updateStats }
}

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return { darkMode, toggleDarkMode }
}

export const useSidebar = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return { sidebarCollapsed, toggleSidebar }
}

// AI Assistant Hook (No changes needed - API abstraction handles the difference)
export const useAIAssistant = () => {
  const [state, setState] = useState<AIAssistantState>({
    currentSession: null,
    sessions: [],
    isLoading: false,
    error: null,
  })

  // Load chat sessions on mount
  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
      const sessions = await getChatSessions()
      setState((prev) => ({ ...prev, sessions, isLoading: false }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to load sessions",
        isLoading: false,
      }))
    }
  }

  const createNewSession = async (title?: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
      const sessionId = await createChatSession(title)

      const newSession: ChatSession = {
        id: sessionId,
        title: title || "New Chat",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setState((prev) => ({
        ...prev,
        currentSession: newSession,
        sessions: [newSession, ...prev.sessions],
        isLoading: false,
      }))

      return sessionId
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to create session",
        isLoading: false,
      }))
      throw error
    }
  }

  const sendMessage = async (content: string) => {
    if (!state.currentSession) {
      await createNewSession()
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
      type: "text",
    }

    // Add user message immediately
    setState((prev) => ({
      ...prev,
      currentSession: prev.currentSession
        ? {
            ...prev.currentSession,
            messages: [...prev.currentSession.messages, userMessage],
            updatedAt: new Date(),
          }
        : null,
      isLoading: true,
      error: null,
    }))

    try {
      const assistantMessage = await sendChatMessage(content, state.currentSession?.id)

      setState((prev) => ({
        ...prev,
        currentSession: prev.currentSession
          ? {
              ...prev.currentSession,
              messages: [...prev.currentSession.messages, assistantMessage],
              updatedAt: new Date(),
            }
          : null,
        isLoading: false,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to send message",
        isLoading: false,
      }))
    }
  }

  const selectSession = (session: ChatSession) => {
    setState((prev) => ({ ...prev, currentSession: session }))
  }

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }))
  }

  return {
    ...state,
    sendMessage,
    createNewSession,
    selectSession,
    loadSessions,
    clearError,
  }
}
