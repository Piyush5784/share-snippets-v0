import { ApiResponse } from "@/utils/formatResponse";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { API_SECRET } from "@/lib/config";
import { prisma } from "@/lib/db";

//validate api key
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization");

    console.log(token);
    if (!token) {
      return ApiResponse({
        message: "Unauthorised user",
        success: false,
        status: 401,
      });
    }

    console.log(token);

    const parsedData = jwt.verify(token, API_SECRET);
    const { id, email } = parsedData as { id: string; email: string };

    if (!id || !email) {
      return ApiResponse({
        message: "Invalid user",
        success: false,
        status: 401,
      });
    }

    return ApiResponse({
      message: "Api Key validation successfull",
      success: true,
    });
  } catch (error) {
    return ApiResponse({
      message: error instanceof Error ? error.message : "Invalid Api key",
      success: false,
      status: 500,
    });
  }
}
