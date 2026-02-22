import { NextResponse } from "next/server";
import { validateProductSearch } from "@/validations/productSearch.validate";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await validateProductSearch(body);

    if(!result) {
      return NextResponse.json(
        { message: "Validation failed" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      message: "Search query received successfully",
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 500 },
    );
  }
}
