import { checkSession, checkUser } from "@/app/actions/checkUser";
import { prisma } from "@/lib/db";
import { createSnippet } from "@/types/zod-schemas";
import { ApiResponse } from "@/utils/formatResponse";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const user = await checkUser();
    const body = await req.json();

    if (!user) {
      return ApiResponse({
        message: "Unauthorised user",
        success: false,
        status: 401,
      });
    }

    const checkBody = createSnippet.safeParse(body);

    if (!checkBody.success) {
      return ApiResponse({
        message: "Invalid data",
        success: false,
        error: z.treeifyError(checkBody.error),
        status: 500,
      });
    }
    const data = checkBody.data;

    await prisma.snippets.create({
      data: {
        isPublic: data.isPublic,
        description: data.description,
        tags: data.tags,
        title: data.title,
        code: data.code,
        language: data.language,
        user: { connect: { id: user.id } },
      },
    });

    return ApiResponse({
      message: "Snippet created successfull",
      success: true,
      status: 201,
    });
  } catch (error) {
    return ApiResponse({
      message:
        error instanceof Error ? error.message : "Failed to create snippet",
      success: false,
      status: 500,
    });
  }
}

// all the private snippets of the user
export async function GET() {
  try {
    // const session = await checkSession();
    const user = await checkUser();

    console.log(user);

    if (!user) {
      return ApiResponse({
        message: "Unauthorised user",
        success: false,
        status: 401,
      });
    }

    const snippets = await prisma.snippets.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        code: true,
        createdAt: true,
        description: true,
        id: true,
        language: true,
        tags: true,
        title: true,
        updatedAt: true,
      },
    });

    if (!snippets) {
      return ApiResponse({
        message: "Snippets not found",
        success: false,
        status: 404,
      });
    }

    return ApiResponse({
      message: "Private Snippets successfully fetched",
      success: true,
      data: snippets,
      status: 200,
    });
  } catch (error) {
    return ApiResponse({
      message:
        error instanceof Error ? error.message : "failed to fetch snippets",
      success: false,
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return ApiResponse({
        message: "Id is required",
        success: false,
        status: 400,
      });
    }

    const user = await checkUser();

    if (!user) {
      return ApiResponse({
        message: "Unauthorised user",
        success: false,
        status: 401,
      });
    }

    const snippet = await prisma.snippets.delete({
      where: {
        id,
        user: { id: user?.id },
      },
    });

    if (!snippet) {
      return ApiResponse({
        message: "Invalid id, data not found",
        success: false,
        status: 404,
      });
    }

    return ApiResponse({
      message: "Snippet successfully deleted",
      success: true,
      status: 200,
    });
  } catch (error) {
    return ApiResponse({
      message:
        error instanceof Error ? error.message : "failed to delete snippet",
      success: false,
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const body = await req.json();

    const user = await checkUser();
    if (!id) {
      return ApiResponse({
        message: "Snippet id is required",
        success: false,
        status: 400,
      });
    }

    const snippet = await prisma.snippets.findUnique({
      where: {
        id,
        user: { id: user?.id },
      },
    });

    if (!snippet) {
      return ApiResponse({
        message: "Invalid id, data not found",
        success: false,
        status: 404,
      });
    }

    const checkBody = createSnippet.safeParse(body);

    if (!checkBody.success) {
      return ApiResponse({
        message: "Invalid data",
        success: false,
        error: z.treeifyError(checkBody.error),
        status: 500,
      });
    }
    const data = checkBody.data;

    await prisma.snippets.update({
      where: {
        userId: user?.id,
        id: snippet.id,
      },
      data: {
        isPublic: data.isPublic,
        description: data.description,
        tags: data.tags,
        title: data.title,
        code: data.code,
        language: data.language,
      },
    });

    return ApiResponse({
      message: "Snippet successfully updated",
      success: true,
      status: 200,
    });
  } catch (error) {
    return ApiResponse({
      message:
        error instanceof Error ? error.message : "Failed to update snippet",
      success: false,
      status: 500,
    });
  }
}
