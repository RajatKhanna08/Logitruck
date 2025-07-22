import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserProfile } from '../../hooks/useUserProfile';
import L from 'leaflet';
import { getLiveLocation, updateLiveLocation } from '../../api/orderApi';
import { updateDriverLocation } from '../../api/driverApi';
import { getPolyline } from '../../api/mapApi';

const TrackOrderPage = ({ order }) => {
  const queryClient = useQueryClient();
  const { data: profile } = useUserProfile();
  const role = profile?.role;

  const [driverLocation, setDriverLocation] = useState(null);
  const mapRef = useRef(null);

  // ✅ Update driver location to DB every 5s (only for DRIVER)
  const updateLocationMutation = useMutation({
    mutationFn: updateLiveLocation,
    onSuccess: () => {
      queryClient.invalidateQueries(['live-location', order._id]);
    },
  });

  const updateDriverLocationMutation = useMutation({
    mutationFn: updateDriverLocation,
  });

  useEffect(() => {
    let intervalId;

    if (role === 'driver' && order?._id) {
      intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newLoc = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            updateLocationMutation.mutate({ ...newLoc });
            updateDriverLocationMutation.mutate({ ...newLoc });
            setDriverLocation(newLoc);
          },
          (err) => console.error('GPS error:', err),
          { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
        );
      }, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [role, order?._id]);

  // 🔄 Poll live location from DB every 5s (for all roles)
  const { data: liveLocation } = useQuery({
    queryKey: ['live-location', order._id],
    queryFn: () => getLiveLocation(order._id),
    refetchInterval: 5000,
    enabled: !!order._id,
  });

  const { data: routeData, isLoading: routeLoading } = useQuery({
    queryKey: ['ors-route', pickup, drop],
    queryFn: () => getPolyline({ pickup, drop }),
    enabled: !!pickup && !!drop,
  });

  const routeCoordinates = routeData?.coordinates || [];

  // 📍 Coordinates
  const pickupCoords = [order.pickup.lat, order.pickup.lng];
  const dropCoords = [order.destination.lat, order.destination.lng];

  const driverCoords = liveLocation
    ? [liveLocation.lat, liveLocation.lng]
    : order?.lastKnownLocation
    ? [order.lastKnownLocation.lat, order.lastKnownLocation.lng]
    : null;

  return (
    <div className="w-full h-[90vh]">
      <MapContainer
        center={pickupCoords}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full rounded-lg z-0"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        {/* 📍 Pickup Marker */}
        <Marker
          position={pickupCoords}
          icon={L.icon({ iconUrl: '/pickup.png', iconSize: [30, 30] })}
        />

        {/* 📍 Destination Marker */}
        <Marker
          position={dropCoords}
          icon={L.icon({ iconUrl: '/destination.png', iconSize: [30, 30] })}
        />

        {/* 🚚 Driver Marker */}
        {driverCoords && (
          <Marker
            position={driverCoords}
            icon={L.icon({ iconUrl: '/truck.png', iconSize: [35, 35] })}
          />
        )}

        {/* Draw route */}
        {routeCoordinates.length > 0 && (
          <Polyline positions={routeCoordinates} color="blue" weight={5} />
        )}
      </MapContainer>
    </div>
  );
};

export default TrackOrderPage;