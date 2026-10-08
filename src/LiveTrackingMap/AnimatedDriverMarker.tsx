import { useEffect, useRef, type ReactNode } from 'react';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

type LatLng = [number, number];

/** Move the Leaflet marker between GPS fixes instead of snapping on each update. */
export default function AnimatedDriverMarker({ position, icon, children }: {
  position: LatLng;
  icon: L.DivIcon;
  children?: ReactNode;
}) {
  const markerRef = useRef<L.Marker | null>(null);
  const initialPosition = useRef<LatLng>(position).current;
  const lastUpdateAt = useRef<number | null>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const target = L.latLng(position[0], position[1]);
    const start = marker.getLatLng();
    const now = performance.now();
    const previousUpdate = lastUpdateAt.current;
    lastUpdateAt.current = now;

    if (previousUpdate === null) {
      marker.setLatLng(target);
      return;
    }

    const distance = start.distanceTo(target);
    if (distance < 3) return;

    const duration = Math.min(4500, Math.max(800, (now - previousUpdate) * 0.9));
    let frame = 0;
    const animate = (time: number) => {
      const progress = Math.min(1, (time - now) / duration);
      marker.setLatLng([
        start.lat + (target.lat - start.lat) * progress,
        start.lng + (target.lng - start.lng) * progress,
      ]);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [position[0], position[1]]);

  return <Marker ref={markerRef} position={initialPosition} icon={icon}>
    {children || <Popup>Chofè a</Popup>}
  </Marker>;
}
