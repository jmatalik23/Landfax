'use client';

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import 'leaflet-geoman-free/dist/leaflet-geoman.css';
import { useEffect } from 'react';

// This adds the drawing toolbar and acre labels
function GeomanControls() {
  const map = useMap();

  useEffect(() => {
    map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: true,
      drawRectangle: true,
      drawPolygon: true,
      drawCircle: true,
      editMode: true,
      cutPolygon: true,
      removalMode: true,
    });

    // Auto-label every polygon with acreage
    const updateArea = (e: any) => {
      const layer = e.layer;
      if (layer instanceof L.Polygon || layer instanceof L.Circle) {
        let areaM2 = 0;
        if (layer instanceof L.Circle) {
          areaM2 = Math.PI * Math.pow(layer.getRadius(), 2);
        } else {
          areaM2 = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        }
        const acres = (areaM2 * 0.000247105).toFixed(2);
        layer.bindTooltip(`${acres} acres`, { permanent: true, direction: 'center' }).openTooltip();
      }
    };

    map.on('pm:create', updateArea);
    map.on('pm:edit', updateArea);
  }, [map]);

  return null;
}

export default function Map() {
  return (
    <MapContainer center={[39.5, -98.35]} zoom={5} style={{ height: '100vh', width: '100vw' }}>
      {/* Satellite basemap */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Esri World Imagery"
      />
      {/* Roads / labels overlay */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
        opacity={0.5}
      />
      <GeomanControls />
    </MapContainer>
  );
}
