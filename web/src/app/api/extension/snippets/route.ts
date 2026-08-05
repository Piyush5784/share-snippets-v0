import { ApiResponse } from "@/utils/formatResponse";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyApiKey } from "@/lib/apiKeyAuth";

// all public snippets + personal user snippets according to token
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

    const snippets = await prisma.snippets.findMany({
      where: {
        isPublic: true,
        userId: { not: user.id },
      },
      take: 5,
    });

    const privateSnippets = await prisma.snippets.findMany({
      where: {
        userId: user.id,
      },
      take: 5,
    });

    return ApiResponse({
      message: "Data successfully fetched",
      data: [...snippets, ...privateSnippets],
      success: true,
    });
  } catch (error) {
    return ApiResponse({
      message:
        error instanceof Error ? error.message : "failed to fetch snippets",
      success: false,
      status: 401,
    });
  }
}
