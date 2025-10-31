import { checkSession } from "@/app/actions/checkUser";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/utils/formatResponse";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await checkSession();

    if (!session) {
      return ApiResponse({
        message: "Unauthorised user",
        success: false,
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return ApiResponse({
        message: "Search query is required",
        success: false,
        status: 400,
      });
    }

    const searchTerm = query.trim();

    const snippets = await prisma.snippets.findMany({
      where: {
        isPublic: true,
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            language: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            tags: {
              hasSome: [searchTerm],
            },
          },
          {
            user: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        ],
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
        _count: {
          select: {
            starredBy: {
              where: {
                userId: session.id,
              },
            },
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      take: 50, // Limit results
    });

    const result = snippets.map((snippet) => {
      const { _count, ...rest } = snippet;
      return {
        ...rest,
        isStarred: _count.starredBy > 0,
      };
    });

    return ApiResponse({
      message: `Found ${result.length} snippets`,
      success: true,
      data: result,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return ApiResponse({
      message:
        error instanceof Error ? error.message : "Failed to search snippets",
      success: false,
      status: 500,
    });
  }
}
