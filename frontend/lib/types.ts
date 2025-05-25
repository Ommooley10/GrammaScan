import type { LucideIcon } from "lucide-react"

export interface GrammarResult {
  sentence: string
  ll1_valid: boolean
  dependency_valid: boolean
  language_tool_issues: string[]
  is_grammatically_correct: boolean
}

export interface Stats {
  totalChecks: number
  grammarScore: number
  improvement: number
  streak: number
}

export interface SidebarItem {
  id: string
  label: string
  icon: LucideIcon
}


export interface GrammarTip {
  title: string
  description: string
  category: string
}

// AI Assistant Types
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: "text" | "grammar_analysis" | "suggestion"
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export interface AIAssistantState {
  currentSession: ChatSession | null
  sessions: ChatSession[]
  isLoading: boolean
  error: string | null
}
