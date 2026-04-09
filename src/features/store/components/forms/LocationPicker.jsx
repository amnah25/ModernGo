import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import L from "leaflet";

function SearchField({ setTempLocation, setSelectedPosition, enabled }) {
  const map = useMap();

  useEffect(() => {
    if (!enabled) return;

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

    const handleShowLocation = (result) => {
      const lat = result.location.y;
      const lng = result.location.x;
      const label = result.location.label;

      setSelectedPosition({ lat, lng });
      setTempLocation({ lat, lng, label });
      map.setView([lat, lng], 15);
    };

    map.addControl(searchControl);
    map.on("geosearch/showlocation", handleShowLocation);

    return () => {
      map.off("geosearch/showlocation", handleShowLocation);
      map.removeControl(searchControl);
    };
  }, [map, enabled, setTempLocation, setSelectedPosition]);

  return null;
}

function LocationMarker({
  setTempLocation,
  selectedPosition,
  setSelectedPosition,
  enabled,
}) {
  useMapEvents({
    click(e) {
      if (!enabled) return;

      const locationData = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        label: `Lat: ${e.latlng.lat.toFixed(6)}, Lng: ${e.latlng.lng.toFixed(6)}`,
      };

      setSelectedPosition(e.latlng);
      setTempLocation(locationData);
    },
  });

  return selectedPosition ? <Marker position={selectedPosition} /> : null;
}

function ChangeMapView({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);

  return null;
}

export default function LocationPicker({ setLocation }) {
  const [userPosition, setUserPosition] = useState([30.0444, 31.2357]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [mode, setMode] = useState(null);

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

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setUserPosition([lat, lng]);
        setSelectedPosition({ lat, lng });
        setTempLocation({
          lat,
          lng,
          label: "Current Location",
        });
        setMode("auto");
      },
      (error) => {
        console.log("Location permission denied", error);
      }
    );
  };

  const handleManual = () => {
    setMode("manual");
    setTempLocation(null);
    setSelectedPosition(null);
  };

  const handleConfirmLocation = () => {
    if (!tempLocation) return;
    setLocation(tempLocation);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
        <button
          type="button"
          onClick={handleUseMyLocation}
          className={`auto-btn ${mode === "auto" ? "active" : ""}`}
        >
          Use my location
        </button>

        <button
          type="button"
          onClick={handleManual}
          className={`manual-btn ${mode === "manual" ? "active" : ""}`}
        >
          Select manually
        </button>
      </div>

      <MapContainer
        center={userPosition}
        zoom={13}
        style={{ height: "400px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeMapView position={selectedPosition ? [selectedPosition.lat, selectedPosition.lng] : userPosition} />

        <SearchField
          enabled={mode === "manual"}
          setTempLocation={setTempLocation}
          setSelectedPosition={setSelectedPosition}
        />

        <LocationMarker
          enabled={mode === "manual"}
          setTempLocation={setTempLocation}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
        />
      </MapContainer>

      {tempLocation && (
        <div style={{ marginTop: "12px" }}>
          <p style={{ marginBottom: "10px", color: "#333" }}>
            <strong>Selected Location:</strong> {tempLocation.label}
          </p>

          <button
            type="button"
            onClick={handleConfirmLocation}
            className="confirm-location-btn"
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}