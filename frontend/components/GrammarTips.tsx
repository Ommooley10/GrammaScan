"use client"
import { grammarTips } from "../lib/constants"

interface GrammarTipsProps {
  darkMode: boolean
}

export default function GrammarTips({ darkMode }: GrammarTipsProps) {
  return (
    <div
      className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg shadow-sm border`}
    >
      <div className={`p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Grammar Tips</h3>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
          Improve your writing with these tips
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {grammarTips.map((tip, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h4 className={`font-medium ${darkMode ? "text-white" : "text-gray-900"} mb-1`}>{tip.title}</h4>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-2`}>{tip.description}</p>
              <span
                className={`inline-block text-xs px-2 py-1 rounded-full ${
                  darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-800"
                }`}
              >
                {tip.category}
              </span>
            </div>
          ))}
        </div>
        <button className="mt-4 text-blue-500 text-sm font-medium hover:text-blue-600 flex items-center">
          View all grammar rules
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
