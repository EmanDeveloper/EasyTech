import { supabase } from "@/lib/DbConnection";
import { ProductSearchData } from "@/types/product";
import { runAgentTinyFish } from "@/lib/TinyFish";

export const validateProductSearch = async (data: ProductSearchData) => {
    const {country, productType, minPrice, maxPrice} = data;

    if (!country || !productType || minPrice === undefined || maxPrice === undefined) {
        throw new Error("All fields are required.");
    }
    if (minPrice < 0 || maxPrice < 0) {
        throw new Error("Price values cannot be negative.");
    }
    if (minPrice >= maxPrice) {
        throw new Error("Min price must be less than max price.");
    }
    
    // 1. Check DB cache first
    const { data: cached } = await supabase
        .from('products')
        .select('*')
        .ilike('country', country)
        .ilike('type', productType)
        .gte('price', minPrice)
        .lte('price', maxPrice)

    if (cached && cached.length > 0) {
        console.log(`Cache hit: returning ${cached.length} products from DB`);
        return cached;
    }

    // 2. No cached results — fetch via TinyFish
    const prompt = `find the ${productType} in ${country} with price between ${minPrice} and ${maxPrice}and also give each product name,price,image,link and website name and also give the result in json format with the following keys: name,type,country, price,link, image, website.`;

    const products = await runAgentTinyFish({ url: "https://www.google.com", goal: prompt });

console.log("Products fetched from TinyFish:", products);
    if (!products || products.length === 0) {
        return [];
    }

    // Sanitize: parse price to a plain number (handles "41999.0 PKR", "41,999 PKR", etc.)
    // Also store the search range used so cache lookups can match exactly.
    const sanitized = products.map((p: any) => ({
        ...p,
        price: typeof p.price === "string"
            ? parseFloat(p.price.replace(/[^0-9.]/g, ""))
            : p.price
    }));

    const { data: inserted, error } = await supabase.from('products').insert(sanitized).select();
    if (error) console.error("Supabase insert error:", error.message, error.details);
    console.log("Inserted products into database:", inserted);
    return inserted ?? [];
}