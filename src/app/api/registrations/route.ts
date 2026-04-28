import { httpJson, withErrorHandler } from "@/lib/http";
import * as service from "@/features/registrations/service";

export const GET = withErrorHandler(async () => {
  const data = await service.listActiveRegistrations();
  return httpJson({ data });
});
