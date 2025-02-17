import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchAPIJSON } from "@/app/lib/api_related/routerFetchFunction";
import { errorHandlerWrapper } from "@/app/lib/error_related/routeErrorHandlerWrapper";
import { throwCustomError } from "@/app/lib/error_related/errorHelper";

if (!process.env.BACKEND_API_URL) {
  throw new Error("BACKEND_API_URL is not defined in environment variables");
}

export const POST = errorHandlerWrapper(
  "Server Failed To Mint",
  async (request: NextRequest) => {
    const body = await request.json();
    const walletDetails = body.walletDetails; // User wallet address

    if (!walletDetails.walletAddress) {
      // throw custom error to be handled by routeErrorHandlerWrapper
      throwCustomError("Wallet Details Not Provided", 400)
    }

    const data = await fetchAPIJSON(
      `${process.env.BACKEND_API_URL}/token/mint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletDetails }),
      }
    )

    return NextResponse.json({ success: true, message: data });
});