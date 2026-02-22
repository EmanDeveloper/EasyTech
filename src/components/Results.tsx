"use client";

import { Search, Sparkles, TrendingUp, CheckCircle, Loader2 } from "lucide-react";

interface ResultsProps {
  response?: any;
  loading?: boolean;
}

export default function Results({ response, loading }: ResultsProps) {
  return (
    <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Search className="w-6 h-6 text-blue-600" />
            Search Results
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">Ready to search</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Sending filter data...</p>
          </div>
        ) : response ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-800 mb-2">{response.message}</h3>
                {response.data && (
                  <div className="bg-white rounded p-3 border border-green-100">
                    <p className="text-sm font-medium text-gray-700 mb-2">Received Filter Data:</p>
                    <pre className="text-xs text-gray-600 overflow-auto">
                      {JSON.stringify(response.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
          {/* Icon Container */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-full border-2 border-blue-200">
              <Search className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          {/* Text Content */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Start Your Search Journey
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-8">
            Apply filters from the sidebar to discover relevant results. Your search experience begins here.
          </p>

          {/* Quick Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
            <div className="bg-linear-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">Smart Filters</h4>
                  <p className="text-xs text-gray-600">Refine your search with precision</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">Live Results</h4>
                  <p className="text-xs text-gray-600">See updates in real-time</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Search className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">Fast Search</h4>
                  <p className="text-xs text-gray-600">Lightning-fast performance</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
