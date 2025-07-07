import { verifyPayment } from "@/controllers/payments.controller";
import { NextResponse } from "next/server";

export async function POST(request) {
    const result = await verifyPayment(request);
    return NextResponse.json(result.body, {status : result.status});
}