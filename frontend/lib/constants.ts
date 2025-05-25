import { BookOpen, PenTool, BarChart3, Home, History, Brain, BookMarked, FileText, Settings } from "lucide-react"
import type { SidebarItem, GrammarTip } from "./types"

export const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "checker", label: "Grammar Checker", icon: PenTool },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "learning", label: "Learning Center", icon: BookOpen },
  { id: "history", label: "History", icon: History },
  { id: "assistant", label: "AI Assistant", icon: Brain },
  { id: "dictionary", label: "Dictionary", icon: BookMarked },
  { id: "rules", label: "Grammar Rules", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
]

export const grammarTips: GrammarTip[] = [
  {
    title: "Subject-Verb Agreement",
    description: "Ensure subjects and verbs agree in number (singular or plural).",
    category: "Basic Grammar",
  },
  {
    title: "Comma Usage",
    description: "Use commas to separate items in a series and before conjunctions.",
    category: "Punctuation",
  },
  {
    title: "Pronoun Clarity",
    description: "Make sure pronouns clearly refer to their antecedents.",
    category: "Clarity",
  },
  {
    title: "Active vs Passive Voice",
    description: "Prefer active voice for clearer, more direct writing.",
    category: "Style",
  },
]

export const getTabTitle = (activeTab: string): string => {
  const titles: Record<string, string> = {
    dashboard: "Dashboard",
    checker: "Grammar Checker",
    analytics: "Analytics",
    learning: "Learning Center",
    history: "History",
    assistant: "AI Assistant",
    dictionary: "Dictionary",
    rules: "Grammar Rules",
    settings: "Settings",
  }
  return titles[activeTab] || "Dashboard"
}

export const getTabDescription = (activeTab: string): string => {
  const descriptions: Record<string, string> = {
    dashboard: "Welcome back! Here's your grammar progress overview.",
    checker: "Check your text for grammar errors and improvements.",
    analytics: "Detailed insights into your writing patterns.",
    learning: "Improve your grammar skills with our resources.",
    history: "Review your past grammar checks and progress.",
    assistant: "Get personalized writing assistance.",
    dictionary: "Look up words and their definitions.",
    rules: "Learn essential grammar rules and guidelines.",
    settings: "Customize your GrammaScan experience.",
  }
  return descriptions[activeTab] || ""
}
