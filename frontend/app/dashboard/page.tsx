"use client"
import { useState } from "react"
import type { GrammarResult } from "@/lib/types"
import { useGrammarStats, useDarkMode, useSidebar } from "@/lib/hooks"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import StatsGrid from "@/components/StatsGrid"
import GrammarChecker from "@/components/GrammarChecker"
import History from "@/components/History"
import RecentActivity from "@/components/RecentActivity"
import GrammarTips from "@/components/GrammarTips"
import AIAssistant from "@/components/AIAssistant"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [grammarHistory, setGrammarHistory] = useState<GrammarResult[]>([])

  const { stats } = useGrammarStats(grammarHistory)
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { sidebarCollapsed, toggleSidebar } = useSidebar()

  const handleGrammarResult = (result: GrammarResult) => {
    const newHistory = [...grammarHistory, result]
    setGrammarHistory(newHistory)
  }

  const clearHistory = () => {
    setGrammarHistory([])
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case "checker":
        return <GrammarChecker darkMode={darkMode} onResult={handleGrammarResult} />

      case "history":
        return <History grammarHistory={grammarHistory} darkMode={darkMode} onClearHistory={clearHistory} />

      case "assistant":
        return <AIAssistant darkMode={darkMode} />

      default:
        return (
          <>
            <StatsGrid stats={stats} darkMode={darkMode} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RecentActivity
                grammarHistory={grammarHistory}
                darkMode={darkMode}
                onStartChecking={() => setActiveTab("checker")}
                onViewAllActivity={() => setActiveTab("history")}
              />
              <GrammarTips darkMode={darkMode} />
            </div>
          </>
        )
    }
  }

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 overflow-auto">
        <Header
          activeTab={activeTab}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          toggleSidebar={toggleSidebar}
        />

        <main className="p-6">{renderMainContent()}</main>
      </div>
    </div>
  )
}
