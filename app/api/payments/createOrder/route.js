import { createOrder } from "@/controllers/payments.controller";
import { NextResponse } from "next/server";

export async function POST(request) {
  const result = await createOrder(request);
  return NextResponse.json(result.body, {status:result.status});
}