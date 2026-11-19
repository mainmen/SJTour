import { z } from 'zod'
import { isInBounds, MAX_BOUNDS } from '@/core/map/config'
import { CATEGORY_IDS, type CategoryId } from '@/core/types/category'

/** Lower-case slug: `parc-industriel-iberville`. */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Expected a lower-case slug (a-z, 0-9, -)')

const nonBlank = z.string().trim().min(1, 'Must not be empty')

/** `{ fr, en }`, both required and non-blank. */
export const bilingualTextSchema = z.strictObject({ fr: nonBlank, en: nonBlank })

/**
 * `[lat, lng]` inside the map bounds. Content is local-only, and the bounds
 * check also catches pairs written as `[lng, lat]` (specs/2026-11-19-data-layer D6).
 */
export const coordinatesSchema = z
  .tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)])
  .refine((point) => isInBounds(point, MAX_BOUNDS), {
    message: 'Coordinates must be [lat, lng] inside Saint-Jean-sur-Richelieu (MAX_BOUNDS)',
  })

/** A real calendar date, `YYYY-MM-DD`. */
export const isoDateSchema = z.iso.date()

/** Fields every record shares (specs/tech-stack.md → Data model principles). */
export const baseRecordShape = {
  id: slugSchema,
  category: z.enum(CATEGORY_IDS),
  name: bilingualTextSchema,
  description: bilingualTextSchema,
  coordinates: coordinatesSchema,
  lastVerified: isoDateSchema,
  /** Placeholder development data; never shipped in production (Phase 13 check). */
  sample: z.boolean().optional(),
  /** Street address, not translated. */
  address: nonBlank.optional(),
  website: z.url({ protocol: /^https$/ }).optional(),
}

export const baseRecordSchema = z.strictObject(baseRecordShape)

export type BaseRecord = z.infer<typeof baseRecordSchema>

/**
 * A category's record schema: the base fields with `category` fixed to `category`,
 * plus the category's own fields. Unknown keys are rejected.
 */
export function defineRecordSchema<C extends CategoryId, S extends z.ZodRawShape>(
  category: C,
  extraShape: S,
) {
  return z.strictObject({ ...baseRecordShape, category: z.literal(category), ...extraShape })
}
