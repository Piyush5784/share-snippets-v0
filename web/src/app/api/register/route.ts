import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/utils/formatResponse";
import { registerSchema } from "@/types/zod-schemas";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const parsedData = registerSchema.safeParse({ email, password, name });

    if (!parsedData.success) {
      return ApiResponse({
        message: "Invalid data",
        status: 400,
        success: false,
      });
    }

    const data = parsedData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return ApiResponse({
        message: "User already exists",
        status: 409,
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 13);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        provider: "CREDENTIALS",
        password: hashedPassword,
      },
    });

    return ApiResponse({
      message: "User created successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      success: true,
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return ApiResponse({
      message: error instanceof Error ? error.message : "failed to create user",
      success: false,
      status: 500,
    });
  }
}
