import { useEffect, useRef, useState } from 'react';
import { Polyline } from 'react-leaflet';

type LatLng = [number, number];
type RouteResponse = { code?: string; routes?: Array<{ geometry?: { coordinates?: Array<[number, number]> } }> };

const routeBase = (import.meta.env.VITE_ROUTING_API_URL || 'https://router.project-osrm.org').replace(/\/$/, '');

function distanceMeters(a: LatLng, b: LatLng) {
  const radians = (value: number) => value * Math.PI / 180;
  const dLat = radians(b[0] - a[0]);
  const dLng = radians(b[1] - a[1]);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a[0])) * Math.cos(radians(b[0])) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export default function RoadRoute({ from, to, color = '#2563eb' }: { from: LatLng; to: LatLng; color?: string }) {
  const [route, setRoute] = useState<LatLng[]>([]);
  const lastRequest = useRef<{ from: LatLng; to: LatLng; at: number } | null>(null);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => () => { controller.current?.abort(); }, []);

  useEffect(() => {
    const previous = lastRequest.current;
    const destinationChanged = !previous || distanceMeters(previous.to, to) > 10;
    const moved = !previous || distanceMeters(previous.from, from) >= 100;
    const waited = !previous || Date.now() - previous.at >= 30000;
    if (!destinationChanged && !moved && !waited) return;

    controller.current?.abort();
    const requestController = new AbortController();
    controller.current = requestController;
    lastRequest.current = { from, to, at: Date.now() };
    const coordinates = `${from[1]},${from[0]};${to[1]},${to[0]}`;
    const url = `${routeBase}/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false`;
    fetch(url, { signal: requestController.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Routing service returned ${response.status}`);
        return response.json() as Promise<RouteResponse>;
      })
      .then((data) => {
        const coordinates = data.code === 'Ok' ? data.routes?.[0]?.geometry?.coordinates : undefined;
        if (coordinates?.length) setRoute(coordinates.map(([lng, lat]) => [lat, lng]));
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== 'AbortError') console.warn('Wout sou lari yo pa disponib kounye a.', error);
      });

  }, [from[0], from[1], to[0], to[1]]);

  return route.length > 1 ? <Polyline positions={route} pathOptions={{ color, weight: 5, opacity: 0.9 }} /> : null;
}
