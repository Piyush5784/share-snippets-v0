import { checkSession } from "@/app/actions/checkUser";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/utils/formatResponse";
import { NextRequest } from "next/server";

// all logged in user , all public snippets
export async function GET(req: NextRequest) {
  try {
    const session = await checkSession();
    const { searchParams } = new URL(req.url);
    const p = searchParams.get("p") ?? "";

    if (!session) {
      return ApiResponse({
        message: "Unauthorised user",
        success: false,
        status: 401,
      });
    }

    const snippets = await prisma.snippets.findMany({
      where: {
        isPublic: true,
        user: {
          is: {},
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        code: true,
        language: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        starredBy: {
          where: {
            userId: session.id,
          },
          select: {
            userId: true,
          },
        },
      },
      take: 5,
    });

    const result = snippets.map((snippet) => ({
      ...snippet,
      isStarred: snippet.starredBy.length > 0,
    }));
    return ApiResponse({
      message:
        snippets.length > 0
          ? "Snippets successfully fetched"
          : "No snippets found",
      success: true,
      data: result,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return ApiResponse({
      message:
        error instanceof Error ? error.message : "failed to fetch snippets",
      success: false,
      status: 500,
    });
  }
}
