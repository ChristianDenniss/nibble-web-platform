/**
 * LocationMap — detailed street map with a draggable dropper pin. Click the map or drag
 * the pin to preview a spot; confirm with the bar at the bottom before it becomes your
 * delivery address. Leaflet `autoPan` keeps the pin on-screen when you drag toward an edge.
 * `followToken` recenters when the selected saved address changes.
 * Lives in `components/location/`.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { Check, X } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import IconButton from '@/components/buttons/IconButton'
import { DEFAULT_MAP_CENTER } from '@/lib/address'

/** Close enough to pick a specific building; min zoom stops “campus wide” views. */
export const HOUSE_ZOOM = 19
export const MIN_ZOOM = 17
export const MAX_ZOOM = 19

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

interface Coords {
  latitude: number
  longitude: number
}

interface Props {
  latitude: number
  longitude: number
  followToken: string
  /** Called only after the user confirms the pin position. */
  onDrop: (coords: Coords) => void
  confirming?: boolean
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

function DropTarget({ onPreview }: { onPreview: (coords: Coords) => void }) {
  useMapEvents({
    click(event) {
      onPreview({ latitude: event.latlng.lat, longitude: event.latlng.lng })
    },
  })
  return null
}

function coordsEqual(a: Coords, b: Coords): boolean {
  return Math.abs(a.latitude - b.latitude) < 1e-6 && Math.abs(a.longitude - b.longitude) < 1e-6
}

export default function LocationMap({
  latitude,
  longitude,
  followToken,
  onDrop,
  confirming = false,
  compact = false,
  className = '',
}: Props) {
  const icon = useMemo(() => pinIcon(), [])
  const lat = Number.isFinite(latitude) ? latitude : DEFAULT_MAP_CENTER.latitude
  const lng = Number.isFinite(longitude) ? longitude : DEFAULT_MAP_CENTER.longitude
  const committed = useMemo(() => ({ latitude: lat, longitude: lng }), [lat, lng])

  const [pin, setPin] = useState(committed)
  const [pending, setPending] = useState(false)
  const lastToken = useRef(followToken)

  useEffect(() => {
    if (lastToken.current !== followToken) {
      lastToken.current = followToken
      setPin(committed)
      setPending(false)
      return
    }
    if (!pending) {
      setPin(committed)
    }
  }, [followToken, committed, pending])

  const heightClass = className.includes('h-') ? '' : compact ? 'h-44' : 'h-64'

  function previewAt(next: Coords) {
    setPin(next)
    setPending(!coordsEqual(next, committed))
  }

  function cancelPreview() {
    setPin(committed)
    setPending(false)
  }

  function confirmPreview() {
    if (!pending) return
    onDrop(pin)
    setPending(false)
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border ${heightClass} ${className}`}
      role="application"
      aria-label="Drop a delivery pin on the map. Confirm before it becomes your address."
    >
      <MapContainer
        center={[pin.latitude, pin.longitude]}
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
        <DropTarget onPreview={previewAt} />
        <Marker
          position={[pin.latitude, pin.longitude]}
          draggable
          autoPan
          autoPanPadding={[56, 56]}
          icon={icon}
          eventHandlers={{
            dragend: (event) => {
              const next = (event.target as L.Marker).getLatLng()
              previewAt({ latitude: next.lat, longitude: next.lng })
            },
          }}
        />
      </MapContainer>

      {pending && (
        <div
          className="pointer-events-auto absolute inset-x-3 bottom-3 z-[1000] flex items-center gap-2 rounded-lg border border-[var(--brand-200)] bg-[var(--brand-100)] px-3 py-2 shadow-md backdrop-blur-sm"
          role="group"
          aria-label="Confirm map pin"
        >
          <p className="min-w-0 flex-1 text-sm text-content">
            {confirming ? 'Saving this address…' : 'Would you like to use this address?'}
          </p>
          <IconButton
            icon={Check}
            title="Use this address"
            size="sm"
            className="shrink-0 text-accent hover:bg-brand/10 hover:text-status-success/70"
            disabled={confirming}
            onClick={confirmPreview}
          />
          <IconButton
            icon={X}
            title="Cancel"
            size="sm"
            disabled={confirming}
            className="text-content-muted hover:bg-brand/10 hover:text-status-danger"
            onClick={cancelPreview}
          />
        </div>
      )}
    </div>
  )
}

