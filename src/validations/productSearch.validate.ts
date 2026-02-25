import { supabase } from "@/lib/DbConnection";
import { ProductSearchData } from "@/types/product";
import { runAgentTinyFish } from "@/lib/TinyFish";

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildPrompt(productType: string, country: string, minPrice: number, maxPrice: number) {
  return `Task: Find products that match the given criteria and return structured results.

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
}

function sanitizeProducts(
  products: any[],
  productType: string,
  country: string,
) {
  return products.map((p: any) => {
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
    };
  });
}

/**
 * Runs a TinyFish search in the background and saves any new results to the DB.
 * Called without await so it does not block the API response.
 */
async function refreshDbFromTinyFish(
  productType: string,
  country: string,
  minPrice: number,
  maxPrice: number,
) {
  try {
    const products = await runAgentTinyFish({
      url: "https://www.google.com",
      goal: buildPrompt(productType, country, minPrice, maxPrice),
    });

    if (!products || products.length === 0) return;

    const sanitized = sanitizeProducts(products, productType, country);

    // Fetch existing product names in this country+type to avoid duplicates
    const { data: existing } = await supabase
      .from("products")
      .select("name")
      .ilike("country", country)
      .ilike("type", productType);

    const existingNames = new Set(
      (existing ?? []).map((r: any) => String(r.name).toLowerCase().trim()),
    );

    const newProducts = sanitized.filter(
      (p) => p.name && !existingNames.has(p.name.toLowerCase()),
    );

    if (newProducts.length > 0) {
      await supabase.from("products").insert(newProducts);
    }
  } catch (err) {
    // Background task – swallow errors so they never surface to the user
    console.error("[TinyFish background refresh]", err);
  }
}

// ─── Main export ─────────────────────────────────────────────────────────────

export const validateProductSearch = async (data: ProductSearchData) => {
  const { country, productType, minPrice, maxPrice } = data;

  if (!country || !productType || minPrice === undefined || maxPrice === undefined) {
    throw new Error("All fields are required.");
  }
  if (minPrice < 0 || maxPrice < 0) {
    throw new Error("Price values cannot be negative.");
  }
  if (minPrice >= maxPrice) {
    throw new Error("Min price must be less than max price.");
  }

  // 1. Query the DB – match country + type, filter by price range
  const { data: dbResults, error: dbError } = await supabase
    .from("products")
    .select("*")
    .ilike("country", country)
    .ilike("type", productType)
    .gte("price", minPrice)
    .lte("price", maxPrice);

  if (dbError) {
    throw new Error("Failed to query the database.");
  }

  if (dbResults && dbResults.length > 0) {
    refreshDbFromTinyFish(productType, country, minPrice, maxPrice).catch(
      () => {},
    );
    return dbResults;
  }

  // 2b. DB is empty for this query → fetch from TinyFish, save, then return
  const products = await runAgentTinyFish({
    url: "https://www.google.com",
    goal: buildPrompt(productType, country, minPrice, maxPrice),
  });

  if (!products || products.length === 0) {
    return [];
  }

  const sanitized = sanitizeProducts(products, productType, country);

  const { data: inserted, error: insertError } = await supabase
    .from("products")
    .insert(sanitized)
    .select();

  if (insertError) {
    throw new Error("Failed to save products to database.");
  }

  return inserted ?? [];
};
