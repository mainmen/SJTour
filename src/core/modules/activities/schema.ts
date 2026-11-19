import { z } from 'zod'
import { defineRecordSchema } from '@/core/schemas/base'

/** "Things to do" groups (specs/tech-stack.md → Data model principles). */
export const SUBCATEGORIES = ['parks', 'culture', 'dining', 'outdoor'] as const

export type Subcategory = (typeof SUBCATEGORIES)[number]

export const activitySchema = defineRecordSchema('activities', {
  subcategory: z.enum(SUBCATEGORIES),
})

export type Activity = z.infer<typeof activitySchema>
