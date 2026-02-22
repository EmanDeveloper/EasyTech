<<<<<<< HEAD
"use client";

import { useState } from "react";
import Filters from "../components/Filters";
import Results from "../components/Results";
=======
import Filters from "../components/Filters";
>>>>>>> 9a5134996beea9ce47b8d2d3a49f5205966c6afb

export default function Welcome() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFilterSubmit = async (filterData: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
<<<<<<< HEAD
      <div>
        <h1 className="text-3xl font-bold mb-8">Easy Search</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <Filters onApplyFilters={handleFilterSubmit} />
          <Results response={response} loading={loading} />
=======
      <div >
        <h1 className="text-3xl font-bold mb-8">Easy Search</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <Filters />

          {/* Main Content / Results Area */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Results</h2>
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg text-gray-500">
              Select filters to see results
            </div>
          </div>
>>>>>>> 9a5134996beea9ce47b8d2d3a49f5205966c6afb
        </div>
      </div>
    </div>
  );
}