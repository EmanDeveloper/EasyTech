import { supabase } from "@/lib/DbConnection";
import { ProductSearchData } from "@/types/product";

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
    
   const res = await supabase.from('products').insert({
        name: productType,
        price: (minPrice + maxPrice) / 2,
        country: country,
        image:"https://via.placeholder.com/150",
        link : "https://example.com/product",
        type: productType
    })

    if(res.error) {
        console.error("Error inserting product:", res.error);
        throw new Error("Database error");
    }

    return true;
}