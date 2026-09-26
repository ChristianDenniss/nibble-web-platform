/**
 * LocationMap — detailed street map with a draggable dropper pin. Click the map or drag
 * the pin to set a delivery location. Leaflet `autoPan` keeps the pin on-screen when
 * you drag toward an edge; it is not locked to the viewport center.
 * `followToken` recenters when the selected address changes.
 * Lives in `components/location/`.
 */
import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DEFAULT_MAP_CENTER } from '@/lib/address'

/** Close enough to pick a specific building; min zoom stops “campus wide” views. */
export const HOUSE_ZOOM = 19
export const MIN_ZOOM = 17
export const MAX_ZOOM = 19

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

interface Props {
  latitude: number
  longitude: number
  followToken: string
  onDrop: (coords: { latitude: number; longitude: number }) => void
  compact?: boolean
  className?: string
}

function pinIcon() {
  return L.divIcon({
    className: 'nibble-map-pin',
    html: '<span class="nibble-map-pin__mark"></span>',
    iconSize: [24, 32],
    iconAnchor: [12, 30],
  })
}

function InvalidateSize() {
  const map = useMap()
  useEffect(() => {
    const id = window.setTimeout(() => map.invalidateSize(), 80)
    return () => window.clearTimeout(id)
  }, [map])
  return null
}

function MapViewportSync({
  latitude,
  longitude,
  token,
}: {
  latitude: number
  longitude: number
  token: string
}) {
  const map = useMap()
  const lastToken = useRef<string | null>(null)

  useEffect(() => {
    const sync = () => {
      map.setView([latitude, longitude], HOUSE_ZOOM, { animate: false })
    }
    const id = window.setTimeout(sync, 100)
    map.on('resize', sync)
    return () => {
      window.clearTimeout(id)
      map.off('resize', sync)
    }
  }, [map, latitude, longitude])

  useEffect(() => {
    if (lastToken.current === token) return
    lastToken.current = token
    map.flyTo([latitude, longitude], HOUSE_ZOOM, { duration: 0.35 })
  }, [token, latitude, longitude, map])

  return null
}

function DropTarget({ onDrop }: { onDrop: Props['onDrop'] }) {
  useMapEvents({
    click(event) {
      onDrop({ latitude: event.latlng.lat, longitude: event.latlng.lng })
    },
  })
  return null
}

export default function LocationMap({
  latitude,
  longitude,
  followToken,
  onDrop,
  compact = false,
  className = '',
}: Props) {
  const icon = useMemo(() => pinIcon(), [])
  const lat = Number.isFinite(latitude) ? latitude : DEFAULT_MAP_CENTER.latitude
  const lng = Number.isFinite(longitude) ? longitude : DEFAULT_MAP_CENTER.longitude
  const heightClass = className.includes('h-') ? '' : compact ? 'h-44' : 'h-64'

  return (
    <div
      className={`overflow-hidden rounded-xl border border-border ${heightClass} ${className}`}
      role="application"
      aria-label="Drop a delivery pin on the map. Click the map or drag the marker."
    >
      <MapContainer
        center={[lat, lng]}
        zoom={HOUSE_ZOOM}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        scrollWheelZoom
        className="z-0 h-full w-full"
        attributionControl
      >
        <TileLayer
          attribution={TILE_ATTRIBUTION}
          url={TILE_URL}
          maxZoom={MAX_ZOOM}
          maxNativeZoom={19}
        />
        <InvalidateSize />
        <MapViewportSync latitude={lat} longitude={lng} token={followToken} />
        <DropTarget onDrop={onDrop} />
        <Marker
          position={[lat, lng]}
          draggable
          autoPan
          autoPanPadding={[56, 56]}
          icon={icon}
          eventHandlers={{
            dragend: (event) => {
              const next = (event.target as L.Marker).getLatLng()
              onDrop({ latitude: next.lat, longitude: next.lng })
            },
          }}
        />
      </MapContainer>
    </div>
  )
}
