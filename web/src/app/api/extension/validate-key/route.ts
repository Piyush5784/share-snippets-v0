import { ApiResponse } from "@/utils/formatResponse";
import { NextRequest } from "next/server";
import { verifyApiKey } from "@/lib/apiKeyAuth";

//validate api key
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization");

    if (!token) {
      return ApiResponse({
        message: "Unauthorised user",
        success: false,
        status: 401,
      });
    }

    const user = await verifyApiKey(token);

    if (!user) {
      return ApiResponse({
        message: "Invalid or revoked API key",
        success: false,
        status: 401,
      });
    }

    return ApiResponse({
      message: "Api Key validation successfull",
      success: true,
    });
  } catch (error) {
    return ApiResponse({
      message: error instanceof Error ? error.message : "Invalid Api key",
      success: false,
      status: 401,
    });
  }
}
