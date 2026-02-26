"use client";

import { useState } from "react";
import Filters from "../components/Filters";
import Results from "../components/Results";
import { supabase } from "@/lib/DbConnection";
import { X } from "lucide-react";

export default function Welcome() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleFilterSubmit = async (filterData: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filterData),
      });
      const data = await res.json();
      console.log('Backend Response:', data);
      setResponse(data);
    } catch (error) {
      console.error('Error sending filter data:', error);
      setResponse({ message: 'Error connecting to server' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return;
    setFeedbackStatus("loading");
    const { error } = await supabase.from("feedBack").insert([{ commit: feedback.trim(), country: "unknown" }]);
    if (error) {
      setFeedbackStatus("error");
    } else {
      setFeedbackStatus("success");
      setFeedback("");
    }
  };

  return (
    <div className="min-h-screen md:h-screen bg-gray-50 flex flex-col p-4 sm:p-6 md:p-8 text-gray-900 md:overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Easy Search</h1>
        {/* Feedback button — visible only on mobile */}
        <button
          onClick={() => { setShowFeedbackModal(true); setFeedbackStatus("idle"); }}
          className="md:hidden bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
        >
          Feedback
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 flex-1 md:min-h-0">
        <Filters onApplyFilters={handleFilterSubmit} />
        <div className="flex-1 md:overflow-y-auto">
          <Results response={response} loading={loading} />
        </div>
      </div>

      {/* Feedback modal — mobile only */}
      {showFeedbackModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 md:hidden"
          onClick={() => setShowFeedbackModal(false)}
        >
          <div
            className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold">Give Feedback</h2>
              <button onClick={() => setShowFeedbackModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">Help us improve your experience.</p>
            <textarea
              placeholder="Share your thoughts..."
              rows={4}
              value={feedback}
              onChange={(e) => { setFeedback(e.target.value); setFeedbackStatus("idle"); }}
              className="w-full p-3 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {feedbackStatus === "success" && (
              <p className="mt-2 text-xs text-green-600">Thank you for your feedback!</p>
            )}
            {feedbackStatus === "error" && (
              <p className="mt-2 text-xs text-red-600">Something went wrong. Please try again.</p>
            )}
            <button
              onClick={handleSubmitFeedback}
              disabled={feedbackStatus === "loading" || !feedback.trim()}
              className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {feedbackStatus === "loading" ? "Submitting..." : "Submit Feedback"}
            </button>
            <a
              href="/feedBack"
              className="mt-2 w-full block text-center border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
            >
              View Feedback
            </a>
          </div>
        </div>
      )}
    </div>
  );
}