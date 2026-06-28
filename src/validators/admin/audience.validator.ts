import { z } from "zod";

import {
  booleanSchema,
  integerSchema,
  optionalTextSchema,
  requiredStringSchema,
} from "./common";

export const audienceInputSchema = z.object({
  name: requiredStringSchema,
  slug: requiredStringSchema,
  description: optionalTextSchema,
  isActive: booleanSchema,
  sortOrder: integerSchema,
});

export type AudienceInput = z.infer<typeof audienceInputSchema>;
