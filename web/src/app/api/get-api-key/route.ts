import { ApiResponse } from "@/utils/formatResponse";
import { prisma } from "@/lib/db";
import { checkUser } from "@/app/actions/checkUser";
import jwt from "jsonwebtoken";
import { API_SECRET } from "@/lib/config";

export async function GET() {
  try {
    const session = await checkUser();

    if (!session) {
      return ApiResponse({
        message: "Unauthorised user",
        success: false,
        status: 401,
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: session.email,
      },
      include: { apiKey: true },
    });

    if (!user) {
      return ApiResponse({
        message: "User not found",
        success: false,
        status: 401,
      });
    }

    if (!user.apiKey) {
      const newApiKey = jwt.sign(
        { id: user.id, email: user.email },
        API_SECRET,
        { expiresIn: "90d" }
      );

      await prisma.apiKey.create({
        data: {
          key: newApiKey,
          userId: user.id,
        },
      });

      return ApiResponse({
        message: "Api key creation successfull",
        success: true,
        data: newApiKey,
        status: 201,
      });
    }

    return ApiResponse({
      message: "Api key fetched successfully",
      success: true,
      data: user.apiKey.key,
      status: 200,
    });
  } catch (error) {
    return ApiResponse({
      message:
        error instanceof Error ? error.message : "Api key creation Failed",
      success: false,
      status: 500,
    });
  }
}
