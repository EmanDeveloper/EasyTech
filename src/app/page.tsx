import Filters from "../components/Filters";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
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
        </div>
      </div>
    </div>
  );
};