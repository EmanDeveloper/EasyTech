"use client";

import { Search, Sparkles, TrendingUp, Loader2, ExternalLink, Store } from "lucide-react";

interface Product {
  id?: number;
  name: string;
  type?: string;
  country?: string;
  price: number;
  link: string;
  image: string;
  website: string;
}

interface ResultsProps {
  response?: { message: string; data: Product[] };
  loading?: boolean;
}

function groupByWebsite(products: Product[]): Record<string, Product[]> {
  return products.reduce<Record<string, Product[]>>((acc, product) => {
    const site = product.website ?? "Unknown";
    if (!acc[site]) acc[site] = [];
    acc[site].push(product);
    return acc;
  }, {});
}

function ProductCard({ product }: { product: Product }) {
  const formattedPrice =
    typeof product.price === "number"
      ? product.price.toLocaleString("en-PK")
      : product.price;

  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/270x270?text=No+Image";
          }}
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white rounded-full p-1">
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
          {product.name}
        </p>
        <p className="mt-auto pt-2 text-base font-bold text-blue-700">
          PKR {formattedPrice}
        </p>
      </div>
    </a>
  );
}

export default function Results({ response, loading }: ResultsProps) {
  const products: Product[] = response?.data ?? [];
  const grouped = groupByWebsite(products);
  const websiteNames = Object.keys(grouped);
  const totalCount = products.length;

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
            <span className="font-medium">
              {loading
                ? "Searching…"
                : totalCount > 0
                ? `${totalCount} product${totalCount !== 1 ? "s" : ""} found`
                : "Ready to search"}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Searching across websites…</p>
            <p className="text-gray-400 text-sm mt-1">This may take a minute</p>
          </div>
        ) : totalCount > 0 ? (
          <div className="space-y-10">
            {websiteNames.map((site) => (
              <section key={site}>
                {/* Website Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Store className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{site}</h3>
                    <p className="text-xs text-gray-500">
                      {grouped[site].length} product{grouped[site].length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {grouped[site].map((product, idx) => (
                    <ProductCard key={product.id ?? `${site}-${idx}`} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : response ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No products found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your filters and searching again.</p>
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