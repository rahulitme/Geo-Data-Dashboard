import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { GeoProject } from '../types';
import './Map.css';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconReticleSrc: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  data: GeoProject[];
  selectedId: string | null;
  onMarkerClick: (id: string) => void;
}

const GeoMap: React.FC<MapProps> = ({ data, selectedId, onMarkerClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<Map<string, L.Marker>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add/update markers
  useEffect(() => {
    if (!map.current || !data.length) return;

    // Create a marker cluster bounds
    const group = new L.FeatureGroup();

    data.forEach((project) => {
      const existingMarker = markers.current.get(project.id);

      if (!existingMarker) {
        const marker = L.marker([project.latitude, project.longitude], {
          title: project.projectName,
        })
          .bindPopup(`<strong>${project.projectName}</strong><br/>Status: ${project.status}`)
          .on('click', () => {
            onMarkerClick(project.id);
          });

        marker.addTo(group);
        markers.current.set(project.id, marker);
      }
    });

    // Add markers to map
    group.addTo(map.current);

    // Fit map bounds if there are markers
    if (group.getLayers().length > 0) {
      map.current.fitBounds(group.getBounds().pad(0.1), {
        maxZoom: 12,
        animate: false,
      });
    }

    return () => {
      group.clearLayers();
    };
  }, [data, onMarkerClick]);

  // Highlight selected marker
  useEffect(() => {
    markers.current.forEach((marker, id) => {
      const isSelected = id === selectedId;

      if (isSelected) {
        marker.setIcon(
          L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconSize: [32, 41],
            iconAnchor: [16, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            shadowSize: [41, 41],
            shadowAnchor: [13, 41],
          })
        );
        marker.openPopup();
        const latLng = marker.getLatLng();
        map.current?.setView(latLng, 10, { animate: true });
      } else {
        marker.setIcon(L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          shadowSize: [41, 41],
          shadowAnchor: [13, 41],
        }));
        marker.closePopup();
      }
    });
  }, [selectedId]);

  return <div ref={mapContainer} className="map-container" />;
};

export default GeoMap;
