import { supabase } from "@/lib/DbConnection";
import { ProductSearchData } from "@/types/product";
import { runAgentTinyFish } from "@/lib/TinyFish";

export const validateProductSearch = async (data: ProductSearchData) => {
  const { country, productType, minPrice, maxPrice } = data;

  if (
    !country ||
    !productType ||
    minPrice === undefined ||
    maxPrice === undefined
  ) {
    throw new Error("All fields are required.");
  }
  if (minPrice < 0 || maxPrice < 0) {
    throw new Error("Price values cannot be negative.");
  }
  if (minPrice >= maxPrice) {
    throw new Error("Min price must be less than max price.");
  }

  const { data: cached } = await supabase
    .from("products")
    .select("*")
    .ilike("country", country)
    .ilike("type", productType)
    .eq("minPrice", minPrice)
    .eq("maxPrice", maxPrice);

  if (cached && cached.length > 0) {
    return cached;
  }

  const prompt = `Task: Find products that match the given criteria and return structured results.

Search Criteria:
- Product Type: ${productType}
- Country: ${country}
- Price Range: ${minPrice} to ${maxPrice}

Instructions:
1. Search only real, currently available products sold in the specified country.
2. Only include products whose price falls within the given range.
3. Do not include out-of-stock or unavailable items.
4. Extract accurate data directly from reliable top 5 e-commerce websites.
5. Do not guess or fabricate missing values.
6. If any field is missing, return null for that field.
7. Remove duplicate products.


Output Format:
Return ONLY valid JSON. No explanation, no extra text.

JSON Structure:
[
  {
    "name": "",
    "type": "${productType}",
    "country": "${country}",
    "price": "",
    "link": "",
    "image": "",
    "website": ""
  }
]`;

  const products = await runAgentTinyFish({
    url: "https://www.google.com",
    goal: prompt,
  });

  if (!products || products.length === 0) {
    return [];
  }

  const sanitized = products.map((p: any) => {
    const rawPrice =
      typeof p.price === "string"
        ? parseFloat(p.price.replace(/[^0-9.]/g, ""))
        : typeof p.price === "number"
          ? p.price
          : null;

    return {
      name: String(p.name ?? "").trim(),
      type: String(p.type ?? productType).trim(),
      country: String(p.country ?? country).trim(),
      price: Number.isFinite(rawPrice) ? rawPrice : null,
      link: p.link ? String(p.link).trim() : null,
      image: p.image ? String(p.image).trim() : null,
      website: p.website ? String(p.website).trim() : null,
      minPrice,
      maxPrice,
    };
  });

  const { data: inserted, error } = await supabase
    .from("products")
    .insert(sanitized)
    .select();
  if (error) {
    throw new Error("Failed to save products to database.");
  }
  return inserted ?? [];
};
