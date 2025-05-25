"use client"
import { HistoryIcon, CheckCircle, AlertCircle } from "lucide-react"
import type { GrammarResult } from "../lib/types"

interface HistoryProps {
  grammarHistory: GrammarResult[]
  darkMode: boolean
  onClearHistory: () => void
}

export default function History({ grammarHistory, darkMode, onClearHistory }: HistoryProps) {
  return (
    <div className="max-w-4xl">
      <div
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg shadow-sm border`}
      >
        <div
          className={`p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"} flex items-center justify-between`}
        >
          <div>
            <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Grammar Check History
            </h3>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
              Your recent grammar analysis results
            </p>
          </div>
          {grammarHistory.length > 0 && (
            <button onClick={onClearHistory} className="text-red-500 hover:text-red-600 text-sm font-medium">
              Clear History
            </button>
          )}
        </div>
        <div className="p-6">
          {grammarHistory.length === 0 ? (
            <div className="text-center py-8">
              <HistoryIcon className={`w-12 h-12 ${darkMode ? "text-gray-500" : "text-gray-400"} mx-auto mb-4`} />
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                No grammar checks yet. Start by checking some text!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {grammarHistory
                .slice()
                .reverse()
                .map((result, index) => (
                  <div key={index} className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <div className="flex items-start justify-between mb-2">
                      <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"} flex-1 mr-4`}>
                        &quot;{result.sentence}&quot;
                      </p>
                      {result.is_grammatically_correct ? (
                        <span className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Correct
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Issues
                        </span>
                      )}
                    </div>

                    {result.language_tool_issues.length > 0 && (
                      <div className="mt-2">
                        <p className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                          Issues found:
                        </p>
                        <ul className="list-disc list-inside text-sm text-red-500 space-y-1">
                          {result.language_tool_issues.map((issue, issueIndex) => (
                            <li key={issueIndex}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
