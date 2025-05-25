"use client"
import { useState } from "react"
import { Send, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import type { GrammarResult } from "../lib/types"
import { checkGrammar } from "@/lib/api"

interface GrammarCheckerProps {
  darkMode: boolean
  onResult: (result: GrammarResult) => void
}

export default function GrammarChecker({ darkMode, onResult }: GrammarCheckerProps) {
  const [inputText, setInputText] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [currentResult, setCurrentResult] = useState<GrammarResult | null>(null)

  const handleCheckGrammar = async () => {
    if (!inputText.trim()) return

    setIsChecking(true)
    try {
      const result = await checkGrammar(inputText)
      setCurrentResult(result)
      onResult(result)
    } catch (error) {
      console.error("Error checking grammar:", error)
      // You might want to show an error message to the user
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg shadow-sm border p-6`}
      >
        <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}>Grammar Checker</h3>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
              Enter text to check:
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
              rows={6}
              placeholder="Type or paste your text here..."
            />
          </div>

          <button
            onClick={handleCheckGrammar}
            disabled={isChecking || !inputText.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isChecking ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            {isChecking ? "Checking..." : "Check Grammar"}
          </button>
        </div>

        {currentResult && (
          <div className={`mt-6 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"} mb-3`}>Analysis Results:</h4>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-800"}`}>Overall Result:</span>
                {currentResult.is_grammatically_correct ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Grammatically Correct
                  </span>
                ) : (
                  <span className="flex items-center text-red-500">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Issues Detected
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-800"}`}>LL1 Parse:</span>
                  {currentResult.ll1_valid ? (
                    <span className="text-green-600">✅ Valid</span>
                  ) : (
                    <span className="text-red-500">❌ Invalid</span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-800"}`}>Dependencies:</span>
                  {currentResult.dependency_valid ? (
                    <span className="text-green-600">✅ Valid</span>
                  ) : (
                    <span className="text-red-500">❌ Invalid</span>
                  )}
                </div>
              </div>

              {currentResult.language_tool_issues.length > 0 && (
                <div>
                  <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-800"}`}>Grammar Issues:</span>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {currentResult.language_tool_issues.map((issue, index) => (
                      <li key={index} className="text-red-500 text-sm">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
