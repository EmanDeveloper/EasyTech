import { NextResponse } from "next/server";
import { validateProductSearch } from "@/validations/productSearch.validate";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const products = await validateProductSearch(body);

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Search completed successfully",
      data: products,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error processing request" },
      { status: 500 },
    );
  }
}
