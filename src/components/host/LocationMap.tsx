import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";

// A simple ember-colored teardrop pin, matching the site's accent color —
// deliberately not Leaflet's default blue marker.
const pinIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 30px; height: 30px; transform: translate(-15px, -28px);
    display: flex; align-items: center; justify-content: center;
  ">
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M15 2C9 2 4 7 4 13c0 8 11 15 11 15s11-7 11-15c0-6-5-11-11-11z"
        fill="hsl(24 95% 50%)" stroke="white" stroke-width="1.5"/>
      <circle cx="15" cy="13" r="4" fill="white"/>
    </svg>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 28],
});

interface Props {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  className?: string;
}

const DEFAULT_CENTER: [number, number] = [15.2993, 74.124]; // Goa

function RecenterOnChange({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();
  const first = useRef(true);
  useEffect(() => {
    if (lat == null || lng == null) return;
    map.flyTo([lat, lng], 15, { duration: first.current ? 0 : 0.6 });
    first.current = false;
  }, [lat, lng, map]);
  return null;
}

function ClickToPlace({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationMap({ lat, lng, onChange, className }: Props) {
  const position: [number, number] = lat != null && lng != null ? [lat, lng] : DEFAULT_CENTER;

  return (
    <div className={className}>
      <MapContainer
        center={position}
        zoom={lat != null ? 15 : 10}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lat != null && lng != null && (
          <Marker
            position={[lat, lng]}
            icon={pinIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target as L.Marker;
                const { lat, lng } = marker.getLatLng();
                onChange(lat, lng);
              },
            }}
          />
        )}
        <ClickToPlace onChange={onChange} />
        <RecenterOnChange lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}
