/** `[latitude, longitude]` in decimal degrees. */
export type LatLng = readonly [lat: number, lng: number]

/** `[southWest, northEast]` corners. */
export type LatLngBounds = readonly [southWest: LatLng, northEast: LatLng]
