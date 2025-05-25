"use client"
import { FileText, Target, TrendingUp, Zap, Clock } from "lucide-react"
import type { Stats } from "../lib/types"

interface StatsGridProps {
  stats: Stats
  darkMode: boolean
}

export default function StatsGrid({ stats, darkMode }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg p-6 shadow-sm border`}
      >
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 ${darkMode ? "bg-blue-900" : "bg-blue-100"} rounded-lg flex items-center justify-center`}
          >
            <FileText className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
          </div>
          <span className="text-sm text-green-600 font-medium">
            {stats.totalChecks > 0 ? `${stats.totalChecks} total` : "Start checking!"}
          </span>
        </div>
        <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-1`}>{stats.totalChecks}</h3>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>Total Checks</p>
      </div>

      <div
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg p-6 shadow-sm border`}
      >
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 ${darkMode ? "bg-green-900" : "bg-green-100"} rounded-lg flex items-center justify-center`}
          >
            <Target className={`w-6 h-6 ${darkMode ? "text-green-400" : "text-green-600"}`} />
          </div>
          <div className={`w-16 h-2 ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full overflow-hidden`}>
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.grammarScore}%` }}
            ></div>
          </div>
        </div>
        <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-1`}>
          {stats.grammarScore}%
        </h3>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>Grammar Score</p>
      </div>

      <div
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg p-6 shadow-sm border`}
      >
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 ${darkMode ? "bg-purple-900" : "bg-purple-100"} rounded-lg flex items-center justify-center`}
          >
            <TrendingUp className={`w-6 h-6 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
          </div>
          <span className={`text-sm font-medium ${stats.improvement >= 0 ? "text-green-600" : "text-red-500"}`}>
            {stats.improvement > 0 ? "+" : ""}
            {stats.improvement}%
          </span>
        </div>
        <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-1`}>
          {stats.improvement > 0 ? "+" : ""}
          {stats.improvement}%
        </h3>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>Improvement</p>
        <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Last 10 vs first 10</p>
      </div>

      <div
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg p-6 shadow-sm border`}
      >
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 ${darkMode ? "bg-orange-900" : "bg-orange-100"} rounded-lg flex items-center justify-center`}
          >
            <Zap className={`w-6 h-6 ${darkMode ? "text-orange-400" : "text-orange-600"}`} />
          </div>
          <Clock className={`w-4 h-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
        </div>
        <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-1`}>{stats.streak}</h3>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>Current Streak</p>
        <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Consecutive correct checks</p>
      </div>
    </div>
  )
}
