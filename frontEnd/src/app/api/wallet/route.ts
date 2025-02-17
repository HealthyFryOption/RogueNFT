import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { useRouter } from 'next/router'
import { fetchAPIJSON } from "@/app/lib/api_related/routerFetchFunction";
import { errorHandlerWrapper } from "@/app/lib/error_related/routeErrorHandlerWrapper";
import { throwCustomError } from "@/app/lib/error_related/errorHelper";

if (!process.env.BACKEND_API_URL) {
  throw new Error("BACKEND_API_URL is not defined in environment variables");
}

// To get Wallet NFTs and Info
export const GET = errorHandlerWrapper(
  "Server Can't Find Wallet",
  async (request: NextRequest) => {
    const walletAddress = request.nextUrl.searchParams.get("walletAddress");

    if (!walletAddress) {
      // throw custom error to be handled by routeErrorHandlerWrapper
      throwCustomError("Wallet Address Not Provided", 400)
    }

    const data = await fetchAPIJSON(
      `${process.env.BACKEND_API_URL}/wallet/get-nfts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
      }
    )

    return NextResponse.json({ success: true, message: data });
});