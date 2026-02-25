"use client";

import { useState } from "react";
import Filters from "../components/Filters";
import Results from "../components/Results";

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
    <div className="h-screen bg-gray-50 flex flex-col p-8 text-gray-900 overflow-hidden">
      <h1 className="text-3xl font-bold mb-4 shrink-0">Easy Search</h1>
      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        <Filters onApplyFilters={handleFilterSubmit}/>
        <div className="flex-1 overflow-y-auto">
          <Results response={response} loading={loading} />
        </div>
      </div>
    </div>
  );
}