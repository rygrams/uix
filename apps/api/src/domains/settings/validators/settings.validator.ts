import { z } from 'zod'

export const updateSettingsSchema = z.object({
  updates: z
    .array(
      z.object({
        key: z.string().min(1),
        value: z.string(),
      }),
    )
    .min(1, 'At least one setting is required'),
})

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
