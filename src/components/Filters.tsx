"use client";

import { useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import { countryCodeToName, countryCodeToCurrency } from "@/lib/countryName";
import { supabase } from "@/lib/DbConnection";


interface FiltersProps {
  onApplyFilters: (filterData: any) => void;
}

const formatPrice = (value: string) => {
  if (!value) return "";
  const num = parseFloat(value.replace(/,/g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString();
};

export default function Filters({ onApplyFilters }: FiltersProps) {
  const [country, setCountry] = useState("");
  const [productType, setProductType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const currency = country ? (countryCodeToCurrency[country] ?? "") : "";

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return;
    setFeedbackStatus("loading");
    const { error } = await supabase.from("feedBack").insert([{
      commit: feedback.trim(),
      country: country ? (countryCodeToName[country] || country) : "unknown",
    }]);
    if (error) {
      setFeedbackStatus("error");
    } else {
      setFeedbackStatus("success");
      setFeedback("");
    }
  };

  const handleApply = () => {
    const newErrors: string[] = [];

    if (!country) newErrors.push("Please select a country.");
    if (!productType) newErrors.push("Please select a product type.");
    if (!minPrice) newErrors.push("Please enter a minimum price.");
    if (!maxPrice) newErrors.push("Please enter a maximum price.");
    
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (minPrice && min < 0) newErrors.push("Min price cannot be negative.");
    if (maxPrice && max < 0) newErrors.push("Max price cannot be negative.");
    if (minPrice && maxPrice && min >= max) {
      newErrors.push("Min price must be less than Max price.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    const filterData = {
      country: countryCodeToName[country] || country,
      productType,
      minPrice: min,
      maxPrice: max,
    };
    console.log("Applied Filters:", filterData);
    onApplyFilters(filterData);
  };

  return (
    <div className="w-full md:w-64 shrink-0 overflow-y-auto h-full pb-10">
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
          <ul className="list-disc pl-4">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Country Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Country</label>
        <ReactFlagsSelect
          selected={country}
          onSelect={(code) => setCountry(code)}
          searchable
          searchPlaceholder="Search countries"
          placeholder="Select Country"
          className="w-full pb-0"
        />
      </div>

      {/* Product Type Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Product Type</label>
        <select 
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="">All Products</option>
          <option value="laptop">Laptop</option>
          <option value="phone">Phone</option>
          <option value="tablet">Tablet</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Price Range</label>
        <div className="flex items-center gap-2">
          <div className="flex flex-col w-full gap-1">
            <span className="text-xs font-semibold text-blue-600 tracking-wide">
              {currency }
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Min"
              value={formatPrice(minPrice)}
              onChange={(e) => setMinPrice(e.target.value.replace(/,/g, ""))}
              className="w-full p-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <span className="text-gray-400 mt-5">—</span>
          <div className="flex flex-col w-full gap-1">
            <span className="text-xs font-semibold text-blue-600 tracking-wide">
              {currency }
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="10,000"
              value={formatPrice(maxPrice)}
              onChange={(e) => setMaxPrice(e.target.value.replace(/,/g, ""))}
              className="w-full p-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <button 
        onClick={handleApply}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        Apply Filters
      </button>
    </div>

    <div className="bg-white mt-6 p-6 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-1">Give Feedback</h2>
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
    </div>
    </div>
  );
}
