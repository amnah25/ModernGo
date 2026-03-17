import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import L from "leaflet";

function SearchField({ setLocation, setSelectedPosition }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      searchLabel: "Search store location...",
      keepResult: true,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      const lat = result.location.y;
      const lng = result.location.x;
      const label = result.location.label;

      setSelectedPosition({ lat, lng });
      setLocation({ lat, lng, label });
      map.setView([lat, lng], 15);
    });

    return () => map.removeControl(searchControl);
  }, [map, setLocation, setSelectedPosition]);

  return null;
}

function LocationMarker({ setLocation, selectedPosition, setSelectedPosition }) {
  useMapEvents({
    click(e) {
      const locationData = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        label: `Lat: ${e.latlng.lat.toFixed(6)}, Lng: ${e.latlng.lng.toFixed(6)}`,
      };

      setSelectedPosition(e.latlng);
      setLocation(locationData);
    },
  });

  return selectedPosition ? <Marker position={selectedPosition} /> : null;
}

export default function LocationPicker({ setLocation }) {
  const [userPosition, setUserPosition] = useState([30.0444, 31.2357]);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserPosition([lat, lng]);
      },
      () => {
        console.log("Location permission denied");
      }
    );
  }, []);

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      center={userPosition}
      zoom={13}
      style={{ height: "400px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <SearchField
        setLocation={setLocation}
        setSelectedPosition={setSelectedPosition}
      />

      <LocationMarker
        setLocation={setLocation}
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}
      />
    </MapContainer>
  );
}