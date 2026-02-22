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
    
    const prompt = `find the ${productType} in ${country} with price between ${minPrice} and ${maxPrice}and also give each product name,price,image,link and website name and also give the result in json format with the following keys: name, price, image, link, website.`;

    const products = await runAgentTinyFish({ url: "https://www.google.com", goal: prompt });
    return products;
}