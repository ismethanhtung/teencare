export type ErrorCode =
  | "VALIDATION_ERROR"
  | "PARENT_NOT_FOUND"
  | "STUDENT_NOT_FOUND"
  | "CLASS_NOT_FOUND"
  | "SUBSCRIPTION_NOT_FOUND"
  | "REGISTRATION_NOT_FOUND"
  | "PARENT_PHONE_DUPLICATE"
  | "PARENT_EMAIL_DUPLICATE"
  | "CLASS_FULL"
  | "SCHEDULE_CONFLICT"
  | "SUBSCRIPTION_EXPIRED"
  | "SUBSCRIPTION_EXHAUSTED"
  | "ALREADY_REGISTERED"
  | "ALREADY_CANCELLED"
  | "SUBSCRIPTION_STUDENT_MISMATCH"
  | "INVALID_ID";

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public status: number,
    message?: string,
    public details?: Record<string, unknown>,
  ) {
    super(message ?? code);
    this.name = "AppError";
  }
}
