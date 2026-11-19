import { z } from 'zod'
import { defineRecordSchema } from '@/core/schemas/base'

/**
 * An ISO 8601 date-time with an explicit offset (`2027-08-14T10:00:00-04:00`).
 * A bare local time would be read in each device's zone (specs/2026-11-19-events D3).
 */
export const offsetDateTimeSchema = z.iso.datetime({ offset: true, local: false })

export const eventSchema = defineRecordSchema('events', {
  startDate: offsetDateTimeSchema,
  endDate: offsetDateTimeSchema,
}).refine((event) => Date.parse(event.endDate) >= Date.parse(event.startDate), {
  message: 'endDate must not be before startDate',
  path: ['endDate'],
})

export type EventRecord = z.infer<typeof eventSchema>
