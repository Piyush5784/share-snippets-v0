import { NextResponse } from "next/server";
import { ZodError } from "zod";

interface ApiResponseProps {
  message: string;
  success: boolean;
  status?: 200 | 400 | 401 | 403 | 404 | 500 | 409 | 201;
  data?: any;
  error?: Error | string | ZodError | any;
}

export function ApiResponse(props: ApiResponseProps) {
  const { status, ...restProps } = props;
  return NextResponse.json(
    {
      ...restProps,
    },
    { status: status }
  );
}
