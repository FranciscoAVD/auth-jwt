import { NextResponse } from "next/server";

type APIResponseType =
  | "Success"
  | "Resource created"
  | "Redirect"
  | "Unauthorized"
  | "Forbidden"
  | "Resource not found"
  | "Unprocessable content"
  | "Conflict"
  | "Internal server error";

const APIResponseStatus: Map<APIResponseType, number> = new Map([
  ["Success", 200],
  ["Resource created", 201],
  ["Redirect", 303],
  ["Unauthorized", 401],
  ["Forbidden", 403],
  ["Resource not found", 404],
  ["Conflict", 409],
  ["Unprocessable content", 422],
  ["Internal server error", 500],
]);

export function apiResponse(
  type: APIResponseType,
  message: string,
  errors?: any,
  data?: any,
): NextResponse {
  return NextResponse.json(
    {
      message,
      errors,
      data,
    },
    {
      status: APIResponseStatus.get(type),
    },
  );
}
