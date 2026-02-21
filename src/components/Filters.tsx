"use client";

import { useState } from "react";
import ReactFlagsSelect from "react-flags-select";

export default function Filters() {
  const [country, setCountry] = useState("");
  const [productType, setProductType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

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
      country,
      productType,
      minPrice: min,
      maxPrice: max,
    };
    console.log("Applied Filters:", filterData);
  };

  return (
    <div className="w-full md:w-64 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
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
          <input 
            type="number" 
            placeholder="Min" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-gray-500">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <button 
        onClick={handleApply}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        Apply Filters
      </button>
    </div>
  );
}
