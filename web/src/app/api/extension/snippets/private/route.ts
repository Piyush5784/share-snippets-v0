import { ApiResponse } from "@/utils/formatResponse";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { API_SECRET } from "@/lib/config";
import { prisma } from "@/lib/db";

// all private snippets
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
        userId: id,
        user: { email },
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
      message: "Data successfully fetched",
      data: snippets,
      success: true,
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
