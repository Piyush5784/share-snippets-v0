import { ApiResponse } from "@/utils/formatResponse";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { API_SECRET } from "@/lib/config";
import { prisma } from "@/lib/db";

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

    const parsedData = jwt.verify(token, API_SECRET);
    const { id, email } = parsedData as { id: string; email: string };

    const snippets = await prisma.snippets.findMany({
      where: {
        isPublic: true,
        userId: { not: id },
      },
      take: 5,
    });

    const privateSnippets = await prisma.snippets.findMany({
      where: {
        userId: id,
      },
      take: 5,
    });

    if (!snippets) {
      return ApiResponse({
        message: "Snippets not found",
        success: false,
        status: 404,
      });
    }

    return ApiResponse({
      message: "Data successfully fetched",
      data: [...snippets, ...privateSnippets],
      success: true,
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
