import { ApiResponse } from "@/utils/formatResponse";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyApiKey } from "@/lib/apiKeyAuth";

// all public snippets + personal user snippets according to token and optional title query
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization");
    const title = req.nextUrl.searchParams.get("title");

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

    const publicCondition: any = { isPublic: true };
    const privateCondition: any = { userId: user.id };

    if (title) {
      publicCondition.title = { contains: title, mode: "insensitive" };
      privateCondition.title = { contains: title, mode: "insensitive" };
    }

    const [snippets, privateSnippets] = await Promise.all([
      prisma.snippets.findMany({
        where: publicCondition,
        take: 5,
      }),
      prisma.snippets.findMany({
        where: privateCondition,
        take: 5,
      }),
    ]);

    const allSnippetsMap = new Map();
    [...snippets, ...privateSnippets].forEach((snippet) => {
      allSnippetsMap.set(snippet.id, snippet);
    });
    const allSnippets = Array.from(allSnippetsMap.values());

    if (allSnippets.length === 0) {
      return ApiResponse({
        message: "Snippets not found",
        success: false,
        status: 404,
      });
    }

    return ApiResponse({
      message: "Data successfully fetched",
      data: allSnippets,
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
