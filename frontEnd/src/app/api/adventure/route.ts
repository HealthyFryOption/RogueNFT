import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchAPIJSON } from "@/app/lib/api_related/routerFetchFunction";
import { errorHandlerWrapper } from "@/app/lib/error_related/routeErrorHandlerWrapper";
import { throwCustomError } from "@/app/lib/error_related/errorHelper";

if (!process.env.BACKEND_API_URL) {
  throw new Error("BACKEND_API_URL is not defined in environment variables");
}

export const POST = errorHandlerWrapper(
  "Server Failed To Let Hero Adventure. Please Try Again Later",
  async (request: NextRequest) => {
    const body = await request.json();
    const walletDetails = body.walletDetails; // User wallet address
    const tokenDetails = body.tokenDetails; // User wallet address
    const stories = body.stories; // User wallet address

    if (!walletDetails.walletAddress || !tokenDetails) {
      // throw custom error to be handled by routeErrorHandlerWrapper
      throwCustomError("Wallet or Hero Details Not Provided", 400)
    }

    const data = await fetchAPIJSON(
      `${process.env.BACKEND_API_URL}/token/adventure`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletDetails, tokenDetails, stories }),
      }
    )

    return NextResponse.json({ success: true, message: data });
});

// To get adventure details
export const GET = errorHandlerWrapper(
    "Server Can't Get Adventure details",
    async (request: NextRequest) => {
      const tokenId = request.nextUrl.searchParams.get("tokenId");
  
      if (!tokenId) {
        // throw custom error to be handled by routeErrorHandlerWrapper
        throwCustomError("TokenId Not Provided", 400)
      }
  
      const data = await fetchAPIJSON(
        `${process.env.BACKEND_API_URL}/token/get-adventures`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tokenId }),
        }
      )
  
      return NextResponse.json({ success: true, message: data });
  });