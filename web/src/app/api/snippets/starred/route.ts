import { checkSession, checkUser } from "@/app/actions/checkUser";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/utils/formatResponse";

export async function POST(req: Request) {
  try {
    const user = await checkUser();
    const { snippetId } = await req.json();

    if (!user || !snippetId) {
      return ApiResponse({
        message: !user ? "Unauthorized user" : "Snippet ID is required",
        success: false,
        status: !user ? 401 : 400,
      });
    }

    const existingSnippet = await prisma.snippets.findFirst({
      where: {
        id: snippetId,
      },
    });

    if (!existingSnippet) {
      return ApiResponse({
        message: "Invalid snippet Id",
        success: false,
        status: 404,
      });
    }

    // Find existing star
    const existingStar = await prisma.starredSnippets.findFirst({
      where: {
        userId: user.id,
        snippetId,
      },
    });

    console.log(existingStar);

    if (existingStar) {
      // Unstar - delete the record
      await prisma.starredSnippets.delete({
        where: {
          id: existingStar.id,
        },
      });

      return ApiResponse({
        message: "Snippet unstarred successfully",
        success: true,
        data: { isStarred: false },
      });
    }

    await prisma.starredSnippets.create({
      data: {
        authorId: existingSnippet.userId,
        userId: user.id,
        snippetId,
        isStarred: true,
      },
    });

    return ApiResponse({
      message: "Snippet starred successfully",
      success: true,
      data: { isStarred: true },
    });
  } catch (error) {
    console.log(error);
    return ApiResponse({
      message:
        error instanceof Error ? error.message : "Failed to save snippet",
      success: false,
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const user = await checkUser();
    if (!user) {
      return ApiResponse({
        message: "Unauthorised user",
        success: false,
        status: 401,
      });
    }

    const starredSnippets = await prisma.starredSnippets.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        userId: true,
        snippetId: true,
        isStarred: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        snippet: {
          select: {
            code: true,
            createdAt: true,
            description: true,
            id: true,
            isPublic: true,
            language: true,
            tags: true,
            title: true,
            updatedAt: true,
          },
        },
      },
    });
    return ApiResponse({
      message: "Saved Snippet successfully fetched",
      success: true,
      data: starredSnippets,
    });
  } catch (error) {
    console.log(error);
    return ApiResponse({
      message:
        error instanceof Error ? error.message : "Failed to get snippets",
      success: false,
      status: 500,
    });
  }
}

export async function PUT() {
  try {
    const user = await checkUser();
  } catch (error) {
    return ApiResponse({
      message:
        error instanceof Error ? error.message : "Failed to update snippet",
      success: false,
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await checkUser();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return;
    }

    if (!user) {
      return ApiResponse({
        message: "Unauthorised user",
        success: false,
        status: 401,
      });
    }

    const starredSnippets = await prisma.starredSnippets.findMany({
      where: {
        userId: user.id,
      },
    });

    return ApiResponse({
      message: "Saved Snippet successfully fetched",
      success: true,
      data: starredSnippets,
    });
  } catch (error) {
    return ApiResponse({
      message:
        error instanceof Error ? error.message : "Failed to delete snippet",
      success: false,
      status: 500,
    });
  }
}
