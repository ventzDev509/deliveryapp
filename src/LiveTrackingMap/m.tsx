import { useEffect, useState, useRef } from 'react';
import { Marker, Tooltip, Polyline, useMap, MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useDriver } from '../Contexts/DriverContext';
import { io } from 'socket.io-client';
import { useAuth } from '../Contexts/AuthContext';
import axios from 'axios';

const socket = io('https://backenddelivery-t22i.onrender.com');

const createCustomIcon = (color: string, emoji: string) => L.divIcon({
    html: `<div style="background-color: ${color}; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: 18px; transition: all 0.5s ease-in-out;">${emoji}</div>`,
    className: 'custom-marker',
    iconSize: [35, 35],
    iconAnchor: [17, 17],
});

// Konpozan pou swiv chofè a sèlman si li sou ON_DELIVERY
function DriverTracker({ driverPosition, isOnDelivery }: { driverPosition: [number, number] | null, isOnDelivery: boolean }) {
    const map = useMap();
    
    useEffect(() => {
        if (driverPosition && isOnDelivery) {
            map.panTo(driverPosition, { animate: true });
        }
    }, [driverPosition, isOnDelivery, map]);

    return null;
}

function MapContent() {
    const { drivers, setDrivers } = useDriver();
    const { user } = useAuth();
    const [myPosition, setMyPosition] = useState<[number, number] | null>(null);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
    const [routeFetched, setRouteFetched] = useState<boolean>(false);
    const map = useMap();

    const routeCoordsRef = useRef<[number, number][]>([]);
    routeCoordsRef.current = routeCoords;

    const driversRef = useRef<any[]>(drivers);
    driversRef.current = drivers;

    // 1. Jwenn pozisyon itilizatè a
    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => setMyPosition([pos.coords.latitude, pos.coords.longitude]),
            (err) => console.error(err),
            { enableHighAccuracy: true }
        );
    }, []);

    // 2. JWENN RESTORAN YO
    useEffect(() => {
        axios.get('https://backenddelivery-t22i.onrender.com/restaurants')
            .then((res) => {
                setRestaurants(res.data);
            })
            .catch((err) => {
                console.error("Erè restoran:", err);
            });
    }, []);

    // 3. REQUISYON OSRM
    useEffect(() => {
        if (!myPosition || routeFetched || restaurants.length === 0) return;

        const targetRest = restaurants[0];
        const restLat = targetRest.owner?.profile?.lat || 19.4470;
        const restLng = targetRest.owner?.profile?.lng || -72.6870;

        const startLng = -72.6850;
        const startLat = 19.4450;
        const midLng = restLng;
        const midLat = restLat;
        const endLng = myPosition[1];
        const endLat = myPosition[0];

        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${midLng},${midLat};${endLng},${endLat}?overview=full&geometries=geojson`;

        axios.get(url)
            .then((res) => {
                if (res.data.routes && res.data.routes.length > 0) {
                    const route = res.data.routes[0];
                    const coords = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);

                    setRouteCoords(coords);
                    setRouteFetched(true);

                    const firstPoint = coords[0];
                    const testDriverId = "62bffbc0-1639-4568-9f08-87f91d7658c9";

                    setDrivers((prev: any[]) => {
                        const exists = prev.some((d: any) => d.id === testDriverId);
                        if (exists) {
                            return prev.map((d: any) =>
                                d.id === testDriverId
                                    ? { ...d, currentLat: firstPoint[0], currentLng: firstPoint[1], status: 'ON_DELIVERY' }
                                    : d
                            );
                        } else {
                            return [...prev, {
                                id: testDriverId,
                                name: 'Chofè Tès',
                                vehicleType: 'MOTORCYCLE',
                                currentLat: firstPoint[0],
                                currentLng: firstPoint[1],
                                status: 'ON_DELIVERY'
                            }];
                        }
                    });
                }
            })
            .catch((err) => {
                console.error("Erè nan OSRM:", err);
                setRouteCoords([[startLat, startLng], [endLat, endLng]]);
            });

    }, [myPosition, restaurants, routeFetched, setDrivers]);

    // 4. RESEVWA POZISYON CHOFÈ A SOU SOCKET AK ANIMASYON LIKID (SMOOTH)
    useEffect(() => {
        socket.on('driverMoved', (data: { driverId: string, lat: number, lng: number }) => {
            setDrivers((prev: any[]) => {
                const driverIndex = prev.findIndex((d: any) => d.id === data.driverId);

                if (driverIndex !== -1) {
                    const currentDriver = prev[driverIndex];
                    const startLat = currentDriver.currentLat ?? data.lat;
                    const startLng = currentDriver.currentLng ?? data.lng;
                    const endLat = data.lat;
                    const endLng = data.lng;

                    // Animatè pou glise makè a pandan tan entèval la (pa egzanp 1800ms)
                    const duration = 1800;
                    const startTime = performance.now();

                    const animate = (currentTime: number) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing (an doulè nan kòmansman ak nan fen) pou l parèt pi natirèl
                        // const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 0.5; 

                        const interpolatedLat = startLat + (endLat - startLat) * progress;
                        const interpolatedLng = startLng + (endLng - startLng) * progress;

                        setDrivers((latestPrev: any[]) =>
                            latestPrev.map((d: any) =>
                                d.id === data.driverId
                                    ? { ...d, currentLat: interpolatedLat, currentLng: interpolatedLng, status: 'ON_DELIVERY' }
                                    : d
                            )
                        );

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };

                    requestAnimationFrame(animate);
                    return prev;
                } else {
                    // Si chofè a pa te la anvan, n ap ajoute l dirèkteman
                    return [...prev, {
                        id: data.driverId,
                        name: 'Chofè Tès',
                        vehicleType: 'MOTORCYCLE',
                        currentLat: data.lat,
                        currentLng: data.lng,
                        status: 'ON_DELIVERY'
                    }];
                }
            });
        });

        return () => { socket.off('driverMoved'); };
    }, [setDrivers]);

    // 5. SIMILASYON DEPLASMAN CHOFÈ A
    useEffect(() => {
        const testDriverId = "62bffbc0-1639-4568-9f08-87f91d7658c9";
        let index = 0;

        const interval = setInterval(() => {
            const activeDriver = driversRef.current.find((d: any) => d.id === testDriverId);
            const coords = routeCoordsRef.current;

            if (!activeDriver || activeDriver.status !== 'ON_DELIVERY' || coords.length === 0) {
                return;
            }

            if (index < coords.length) {
                const point = coords[index];
                socket.emit('updateLocation', {
                    driverId: testDriverId,
                    lat: point[0],
                    lng: point[1]
                });
                index++;
            } else {
                index = 0; 
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [routeFetched]);

    const isSeller = user?.role === 'RESTAURANT_OWNER';
    const markerColor = isSeller ? '#f59e0b' : '#3b82f6';
    const markerEmoji = isSeller ? '🏪' : '👤';
    const displayName = isSeller ? (user?.profile?.username || user?.email || 'Magazen Mwen') : 'Mwen';

    const testDriverId = "62bffbc0-1639-4568-9f08-87f91d7658c9";
    const activeDriver = drivers.find((d: any) => d.id === testDriverId);
    const driverPosition: [number, number] | null = activeDriver?.currentLat && activeDriver?.currentLng
        ? [activeDriver.currentLat, activeDriver.currentLng]
        : null;
    
    const isOnDelivery = activeDriver?.status === 'ON_DELIVERY';

    return (
        <>
            <DriverTracker driverPosition={driverPosition} isOnDelivery={isOnDelivery} />

            {routeCoords.length > 0 && (
                <Polyline
                    positions={routeCoords}
                    pathOptions={{ color: '#3b82f6', weight: 6, opacity: 0.7 }}
                />
            )}

            {myPosition && (
                <Marker position={myPosition} icon={createCustomIcon(markerColor, markerEmoji)}>
                    <Tooltip permanent direction="top" className="custom-user-tooltip">
                        {displayName}
                    </Tooltip>
                </Marker>
            )}

            {restaurants.map((rest) => {
                const lat = rest.owner?.profile?.lat || 19.445;
                const lng = rest.owner?.profile?.lng || -72.685;

                return (
                    <Marker
                        key={rest.id}
                        position={[lat, lng]}
                        icon={createCustomIcon('#f59e0b', '🏪')}
                    >
                        <Tooltip permanent direction="top" className="custom-restaurant-tooltip">
                            {rest.name || 'Restoran'}
                        </Tooltip>
                    </Marker>
                );
            })}

            {drivers.filter(d => d.currentLat && d.currentLng).map(d => {
                let distanceText = '';
                let timeText = '';

                if (myPosition && map) {
                    const distanceMeters = map.distance(
                        [d.currentLat!, d.currentLng!],
                        [myPosition[0], myPosition[1]]
                    );

                    if (distanceMeters >= 1000) {
                        distanceText = ` - ${(distanceMeters / 1000).toFixed(1)} km`;
                    } else {
                        distanceText = ` - ${Math.round(distanceMeters)} m`;
                    }

                    const averageSpeedMps = 8.33;
                    const estimatedSecondsRemaining = distanceMeters / averageSpeedMps;
                    const minutes = Math.floor(estimatedSecondsRemaining / 60);
                    const seconds = Math.round(estimatedSecondsRemaining % 60);

                    if (distanceMeters < 20) {
                        timeText = ` ⏱️ Rive!`;
                    } else if (minutes > 0) {
                        timeText = ` ⏱️ ${minutes} min`;
                    } else {
                        timeText = ` ⏱️ ${seconds} sek`;
                    }
                }

                return (
                    <Marker
                        key={d.id}
                        position={[d.currentLat!, d.currentLng!]}
                        icon={createCustomIcon('#16a34a', d.vehicleType === 'MOTORCYCLE' ? '🏍️' : '🚗')}
                    >
                        <Tooltip permanent direction="top" className="custom-driver-tooltip">
                            {d.name} {distanceText} {timeText}
                        </Tooltip>
                    </Marker>
                );
            })}
        </>
    );
}

export default function SimpleMap() {
    useEffect(() => {
        socket.on('connect', () => {
            console.log('✅ Konekte ak sèvè a! ID:', socket.id);
        });

        socket.on('connect_error', (err) => {
            console.log('❌ Erè koneksyon:', err.message);
        });
    }, []);

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <MapContainer center={[19.445, -72.685]} zoom={15.5} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapContent />
            </MapContainer>
        </div>
    );
}