"use client"
import { PenTool, Award, ChevronLeft, ChevronRight } from "lucide-react"
import { sidebarItems } from "../lib/constants"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  darkMode: boolean
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

export default function Sidebar({ activeTab, setActiveTab, darkMode, sidebarCollapsed, toggleSidebar }: SidebarProps) {
  return (
    <div
      className={`${
        sidebarCollapsed ? "w-16" : "w-64"
      } ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg border-r relative transition-all duration-300 ease-in-out`}
    >
      {/* Sidebar Header */}
      <div
        className={`p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"} flex items-center justify-between`}
      >
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>GrammaScan</h1>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <PenTool className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`absolute -right-3 top-20 w-6 h-6 ${
          darkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-600"
        } border rounded-full flex items-center justify-center hover:${
          darkMode ? "bg-gray-600" : "bg-gray-50"
        } transition-colors z-10`}
      >
        {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Navigation */}
      <nav className={`mt-6 ${sidebarCollapsed ? "pb-4" : "pb-20"}`}>
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${
                  sidebarCollapsed ? "px-4 py-3 justify-center" : "px-6 py-3"
                } text-left transition-colors ${
                  activeTab === item.id
                    ? `${darkMode ? "bg-blue-900 text-blue-400" : "bg-blue-50 text-blue-700"} border-r-2 border-blue-700`
                    : `${darkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`
                }`}
              >
                <Icon className={`w-5 h-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
                {!sidebarCollapsed && item.label}
              </button>

              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Pro Upgrade Section - Only show when not collapsed */}
      {!sidebarCollapsed && (
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 text-white text-sm">
            <div className="flex items-center mb-2">
              <Award className="w-4 h-4 mr-2" />
              <span className="font-semibold text-sm">GrammaScan Pro</span>
            </div>
            <p className="text-xs text-blue-100 mb-2">Upgrade for advanced features.</p>
            <button className="w-full bg-white text-blue-600 py-1.5 px-3 rounded text-xs font-medium hover:bg-blue-50 transition-colors">
              Upgrade
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
