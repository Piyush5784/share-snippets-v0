import { checkSession, checkUser } from "@/app/actions/checkUser";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/utils/formatResponse";
import { NextRequest } from "next/server";

// all unknown user , get snippet by id
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const user = await checkUser();

    if (!user) {
      return ApiResponse({
        message: "Unauthorised access not allowed",
        success: false,
        status: 401,
      });
    }

    if (!id) {
      return ApiResponse({
        message: "Id id required",
        success: false,
        status: 401,
      });
    }

    const snippets = await prisma.snippets.findUnique({
      where: {
        id: id,
        userId: user.id,
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
      message: "Snippets successfully fetched",
      success: true,
      data: snippets,
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
