import { z } from "zod";

import { requiredStringSchema } from "./common";

export const storeSettingInputSchema = z.object({
  key: requiredStringSchema,
  value: z.string(),
});

export type StoreSettingInput = z.infer<typeof storeSettingInputSchema>;
