"use client";
import React, { useState, useEffect,useCallback } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  TrendingUp, 
  PenTool,
  Target,
  BarChart3,
  Clock,
  Award,
  AlertCircle,
  FileText,
  Zap,
  Settings,
  User,
  Home,
  History,
  Brain,
  BookMarked,
  Send,
  RefreshCw
} from 'lucide-react';

// Types based on your backend models
interface GrammarResult {
  sentence: string;
  ll1_valid: boolean;
  dependency_valid: boolean;
  language_tool_issues: string[];
  is_grammatically_correct: boolean;
}

const GrammaScanDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inputText, setInputText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [grammarHistory, setGrammarHistory] = useState<GrammarResult[]>([]);
  const [currentResult, setCurrentResult] = useState<GrammarResult | null>(null);
  
  // Mock data for demonstration - replace with actual API calls
  const [stats, setStats] = useState({
    totalChecks: 0,
    grammarScore: 100,
    improvement: 0,
    streak: 0
  });

  useEffect(() => {
    // Load history from localStorage on component mount
    const savedHistory = localStorage.getItem('grammarHistory');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setGrammarHistory(history);
      updateStats(history);
    }
  }, []);

const updateStats = useCallback((history: GrammarResult[]) => {
  const totalChecks = history.length;
  const correctChecks = history.filter(r => r.is_grammatically_correct).length;
  const grammarScore = totalChecks > 0 ? Math.round((correctChecks / totalChecks) * 100) : 100;

  let improvement = 0;
  if (totalChecks >= 20) {
    const firstTen = history.slice(0, 10);
    const lastTen = history.slice(-10);
    const firstScore = (firstTen.filter(r => r.is_grammatically_correct).length / 10) * 100;
    const lastScore = (lastTen.filter(r => r.is_grammatically_correct).length / 10) * 100;
    improvement = Math.round(lastScore - firstScore);
  }

  setStats({
    totalChecks,
    grammarScore,
    improvement,
    streak: calculateStreak(history)
  });
}, [setStats]);


  const calculateStreak = (history: GrammarResult[]): number => {
    let streak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].is_grammatically_correct) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const checkGrammar = async () => {
    if (!inputText.trim()) return;
    
    setIsChecking(true);
    try {
      const response = await fetch('https://gramma-backend.onrender.com/check_grammar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GrammarResult = await response.json();
      setCurrentResult(result);
      
      // Add to history
      const newHistory = [...grammarHistory, result];
      setGrammarHistory(newHistory);
      updateStats(newHistory);
      
      // Save to localStorage
      localStorage.setItem('grammarHistory', JSON.stringify(newHistory));
      
    } catch (error) {
      console.error('Error checking grammar:', error);
      // You might want to show an error message to the user
    } finally {
      setIsChecking(false);
    }
  };

  const clearHistory = () => {
    setGrammarHistory([]);
    setCurrentResult(null);
    setStats({ totalChecks: 0, grammarScore: 100, improvement: 0, streak: 0 });
    localStorage.removeItem('grammarHistory');
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'checker', label: 'Grammar Checker', icon: PenTool },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'learning', label: 'Learning Center', icon: BookOpen },
    { id: 'history', label: 'History', icon: History },
    { id: 'assistant', label: 'AI Assistant', icon: Brain },
    { id: 'dictionary', label: 'Dictionary', icon: BookMarked },
    { id: 'rules', label: 'Grammar Rules', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const grammarTips = [
    {
      title: "Subject-Verb Agreement",
      description: "Ensure subjects and verbs agree in number (singular or plural).",
      category: "Basic Grammar"
    },
    {
      title: "Comma Usage",
      description: "Use commas to separate items in a series and before conjunctions.",
      category: "Punctuation"
    },
    {
      title: "Pronoun Clarity",
      description: "Make sure pronouns clearly refer to their antecedents.",
      category: "Clarity"
    },
    {
      title: "Active vs Passive Voice",
      description: "Prefer active voice for clearer, more direct writing.",
      category: "Style"
    }
  ];

  const renderMainContent = () => {
    switch (activeTab) {
      case 'checker':
        return (
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Grammar Checker</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter text to check:
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                    placeholder="Type or paste your text here..."
                  />
                </div>
                
                <button
                  onClick={checkGrammar}
                  disabled={isChecking || !inputText.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isChecking ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isChecking ? 'Checking...' : 'Check Grammar'}
                </button>
              </div>

              {currentResult && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Analysis Results:</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Overall Result:</span>
                      {currentResult.is_grammatically_correct ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Grammatically Correct
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Issues Detected
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">LL1 Parse:</span>
                        {currentResult.ll1_valid ? (
                          <span className="text-green-600">✅ Valid</span>
                        ) : (
                          <span className="text-red-600">❌ Invalid</span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Dependencies:</span>
                        {currentResult.dependency_valid ? (
                          <span className="text-green-600">✅ Valid</span>
                        ) : (
                          <span className="text-red-600">❌ Invalid</span>
                        )}
                      </div>
                    </div>

                    {currentResult.language_tool_issues.length > 0 && (
                      <div>
                        <span className="font-medium">Grammar Issues:</span>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {currentResult.language_tool_issues.map((issue, index) => (
                            <li key={index} className="text-red-600 text-sm">{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Grammar Check History</h3>
                  <p className="text-gray-600 text-sm">Your recent grammar analysis results</p>
                </div>
                {grammarHistory.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear History
                  </button>
                )}
              </div>
              <div className="p-6">
                {grammarHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No grammar checks yet. Start by checking some text!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {grammarHistory.slice().reverse().map((result, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-gray-900 flex-1 mr-4">"{result.sentence}"</p>
                          {result.is_grammatically_correct ? (
                            <span className="flex items-center text-green-600 text-sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Correct
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600 text-sm">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Issues
                            </span>
                          )}
                        </div>
                        
                        {result.language_tool_issues.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">Issues found:</p>
                            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
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
        );

      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">
                    {stats.totalChecks > 0 ? `${stats.totalChecks} total` : 'Start checking!'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalChecks}</h3>
                <p className="text-gray-600 text-sm">Total Checks</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${stats.grammarScore}%` }}
                    ></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.grammarScore}%</h3>
                <p className="text-gray-600 text-sm">Grammar Score</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className={`text-sm font-medium ${stats.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.improvement > 0 ? '+' : ''}{stats.improvement}%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.improvement > 0 ? '+' : ''}{stats.improvement}%
                </h3>
                <p className="text-gray-600 text-sm">Improvement</p>
                <p className="text-xs text-gray-500">Last 10 vs first 10</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-orange-600" />
                  </div>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.streak}</h3>
                <p className="text-gray-600 text-sm">Current Streak</p>
                <p className="text-xs text-gray-500">Consecutive correct checks</p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-gray-600 text-sm">Your recent grammar checks and improvements</p>
                </div>
                <div className="p-6">
                  {grammarHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <PenTool className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No recent activity yet.</p>
                      <button
                        onClick={() => setActiveTab('checker')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Grammar Checking
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {grammarHistory.slice(-5).reverse().map((activity, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            activity.is_grammatically_correct 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {activity.is_grammatically_correct ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <AlertCircle className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 text-sm font-medium mb-1">"{activity.sentence}"</p>
                            {activity.language_tool_issues.length > 0 && (
                              <div className="mb-2">
                                {activity.language_tool_issues.slice(0, 2).map((error, errorIndex) => (
                                  <span
                                    key={errorIndex}
                                    className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mr-2 mb-1"
                                  >
                                    {error.length > 50 ? error.substring(0, 50) + '...' : error}
                                  </span>
                                ))}
                                {activity.language_tool_issues.length > 2 && (
                                  <span className="text-xs text-gray-500">
                                    +{activity.language_tool_issues.length - 2} more
                                  </span>
                                )}
                              </div>
                            )}
                            <p className="text-gray-500 text-xs">Just checked</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {grammarHistory.length > 0 && (
                    <button 
                      onClick={() => setActiveTab('history')}
                      className="mt-4 text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center"
                    >
                      View all activity
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Grammar Tips */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Grammar Tips</h3>
                  <p className="text-gray-600 text-sm">Improve your writing with these tips</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {grammarTips.map((tip, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{tip.description}</p>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {tip.category}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
                    View all grammar rules
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">GrammaScan</h1>
          </div>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        {/* Pro Upgrade Section */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center mb-2">
              <Award className="w-5 h-5 mr-2" />
              <span className="font-semibold">GrammaScan Pro</span>
            </div>
            <p className="text-sm text-blue-100 mb-3">
              Upgrade for advanced features and unlimited checks.
            </p>
            <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'dashboard' && 'Welcome to GrammaScan'}
                {activeTab === 'checker' && 'Grammar Checker'}
                {activeTab === 'history' && 'Check History'}
                {activeTab === 'analytics' && 'Analytics'}
                {activeTab === 'learning' && 'Learning Center'}
                {activeTab === 'assistant' && 'AI Assistant'}
                {activeTab === 'dictionary' && 'Dictionary'}
                {activeTab === 'rules' && 'Grammar Rules'}
                {activeTab === 'settings' && 'Settings'}
              </h2>
              <p className="text-gray-600">
                {activeTab === 'dashboard' && 'Your advanced grammar analysis dashboard'}
                {activeTab === 'checker' && 'Check your text for grammar, syntax, and style issues'}
                {activeTab === 'history' && 'Review your previous grammar checks and improvements'}
                {activeTab !== 'dashboard' && activeTab !== 'checker' && activeTab !== 'history' && 'Feature coming soon'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('checker')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <PenTool className="w-4 h-4 mr-2" />
                Check Grammar
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default GrammaScanDashboard;