import { nextAuthOptions } from "@/lib/auth";
import { ApiResponse } from "@/utils/formatResponse";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { checkSession, checkUser } from "@/app/actions/checkUser";
import jwt from "jsonwebtoken";
import { API_SECRET } from "@/lib/config";

export async function GET() {
  try {
    const session = await checkUser();

    console.log(session);

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
    });

    if (!user) {
      return ApiResponse({
        message: "User not found",
        success: false,
        status: 401,
      });
    }

    if (!user?.apiKey) {
      console.log("New key generated");
      const newApiKey = jwt.sign(
        { id: user.id, email: user.email },
        API_SECRET
      );

      await prisma.user.update({
        where: { email: user.email },
        data: {
          apiKey: newApiKey,
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
      data: user.apiKey,
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
