"use client"
import { Menu, Sun, Moon, User } from "lucide-react"
import { getTabTitle, getTabDescription } from "../lib/constants"

interface HeaderProps {
  activeTab: string
  darkMode: boolean
  toggleDarkMode: () => void
  toggleSidebar: () => void
}

export default function Header({ activeTab, darkMode, toggleDarkMode, toggleSidebar }: HeaderProps) {
  return (
    <header
      className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-sm border-b px-6 py-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button - only show on mobile */}
          <button
            onClick={toggleSidebar}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {getTabTitle(activeTab)}
            </h2>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>{getTabDescription(activeTab)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? "bg-gray-700 text-yellow-400 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div
            className={`w-8 h-8 ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full flex items-center justify-center`}
          >
            <User className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
          </div>
        </div>
      </div>
    </header>
  )
}
