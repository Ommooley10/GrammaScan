"use client"
import { PenTool, CheckCircle, AlertCircle } from "lucide-react"
import type { GrammarResult } from "../lib/types"

interface RecentActivityProps {
  grammarHistory: GrammarResult[]
  darkMode: boolean
  onStartChecking: () => void
  onViewAllActivity: () => void
}

export default function RecentActivity({
  grammarHistory,
  darkMode,
  onStartChecking,
  onViewAllActivity,
}: RecentActivityProps) {
  return (
    <div
      className={`lg:col-span-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg shadow-sm border`}
    >
      <div className={`p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Recent Activity</h3>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
          Your recent grammar checks and improvements
        </p>
      </div>
      <div className="p-6">
        {grammarHistory.length === 0 ? (
          <div className="text-center py-8">
            <PenTool className={`w-12 h-12 ${darkMode ? "text-gray-500" : "text-gray-400"} mx-auto mb-4`} />
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>No recent activity yet.</p>
            <button
              onClick={onStartChecking}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Grammar Checking
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {grammarHistory
              .slice(-5)
              .reverse()
              .map((activity, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-4 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.is_grammatically_correct
                        ? `${darkMode ? "bg-green-900 text-green-400" : "bg-green-100 text-green-600"}`
                        : `${darkMode ? "bg-red-900 text-red-400" : "bg-red-100 text-red-600"}`
                    }`}
                  >
                    {activity.is_grammatically_correct ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`${darkMode ? "text-white" : "text-gray-900"} text-sm font-medium mb-1`}>
                      &quot;{activity.sentence}&quot;
                    </p>
                    {activity.language_tool_issues.length > 0 && (
                      <div className="mb-2">
                        {activity.language_tool_issues.slice(0, 2).map((error, errorIndex) => (
                          <span
                            key={errorIndex}
                            className={`inline-block text-xs px-2 py-1 rounded-full mr-2 mb-1 ${
                              darkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {error.length > 50 ? error.substring(0, 50) + "..." : error}
                          </span>
                        ))}
                        {activity.language_tool_issues.length > 2 && (
                          <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            +{activity.language_tool_issues.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                    <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xs`}>Just checked</p>
                  </div>
                </div>
              ))}
          </div>
        )}
        {grammarHistory.length > 0 && (
          <button
            onClick={onViewAllActivity}
            className="mt-4 text-blue-500 text-sm font-medium hover:text-blue-600 flex items-center"
          >
            View all activity
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
