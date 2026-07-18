import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useDriver } from '../Contexts/DriverContext';

// 1. Konfigirasyon Ikon Vizib (DivIcon)
const createCustomIcon = (color: string, emoji: string) => L.divIcon({
    html: `<div style="background-color: ${color}; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: 18px;">${emoji}</div>`,
    className: 'custom-marker',
    iconSize: [35, 35],
    iconAnchor: [17, 17],
});

// Done simulation pou User ak Restoran
const mockData = {
    users: [{ id: 'u1', lat: 19.465, lng: -72.675, name: "Kliyan: Rue du Soleil" },
        { id: 'u1', lat: 19.445, lng: -72.681, name: "Kliyan: 3" }
    ],
    restaurants: [{ id: 'r1', lat: 19.440, lng: -72.670, name: "Restoran: Pòtoprens Burger" }]
};

// 2. Konpozan Routing
function Routing({ start, end }: { start: [number, number], end: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (!map) return;
        const routingControl = (L as any).Routing.control({
            waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
            router: (L as any).Routing.osrmv1({ profile: 'car' }),
            lineOptions: { styles: [{ color: '#3b82f6', weight: 6, opacity: 0.7 }] },
            addWaypoints: false,
            draggableWaypoints: false,
            routeWhileDragging: false,
            show: false,
            createMarker: () => null
        }).addTo(map);
        return () => { map.removeControl(routingControl); };
    }, [map, start, end]);
    return null;
}

// 3. Konpozan pou "Focus" kat la sou yon kowòdone
function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 16);
    }, [center, map]);
    return null;
}

// 4. Konpozan prensipal Map la
function MapContent() {
    const { drivers } = useDriver();

    return (
        <>
            {/* Santre kat la sou premye kliyan an */}
            {mockData.users.length > 0 && <MapController center={[mockData.users[0].lat, mockData.users[0].lng]} />}

            {/* Kliyan */}
            {mockData.users.map(u => (
                <Marker key={u.id} position={[u.lat, u.lng]} icon={createCustomIcon('#3b82f6', '👤')}>
                    <Tooltip permanent direction="top">{u.name}</Tooltip>
                </Marker>
            ))}

            {/* Chofè yo */}
            {drivers
                .filter(d => d.currentLat !== null && d.currentLng !== null)
                .map(d => (
                    <React.Fragment key={d.id}>
                        <Marker
                            position={[d.currentLat!, d.currentLng!]}
                            icon={createCustomIcon('#16a34a', d.vehicleType === 'MOTORCYCLE' ? '🏍️' : '🚗')}
                        >
                            <Tooltip permanent direction="top">{d.name}</Tooltip>
                        </Marker>

                        {/* Wout la parèt sèlman lè estati a se ON_DELIVERY */}
                        {d.status === 'ON_DELIVERY' && mockData.users.length > 0 && (
                            <Routing
                                start={[d.currentLat!, d.currentLng!]}
                                end={[mockData.users[0].lat, mockData.users[0].lng]}
                            />
                        )}
                    </React.Fragment>
                ))}

            {/* Restoran */}
            {mockData.restaurants.map(r => (
                <Marker key={r.id} position={[r.lat, r.lng]} icon={createCustomIcon('#ef4444', '🍽️')}>
                    <Tooltip permanent direction="top">{r.name}</Tooltip>
                </Marker>
            ))}
        </>
    );
}

export default function SimpleMap() {
    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <MapContainer center={[19.445, -72.685]} zoom={16} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapContent />
            </MapContainer>
        </div>
    );
}