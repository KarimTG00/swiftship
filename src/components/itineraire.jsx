// export default function Itineraire({ itineraire }) {
//   return (
//     <div className="bg-gray-200 min-h-80 flex justify-center items-center">
//       {itineraire.erreur && <h2>{itineraire.erreur}</h2>}
//     </div>
//   );
// }

import { useState, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 48.8566,
  lng: 2.3522,
};

export default function MapItineraire({ depart, destination }) {
  const [directions, setDirections] = useState(null);
  const CLE_API_GOOGLE = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  const directionsCallback = useCallback((response) => {
    if (response !== null && response.status === "OK") {
      setDirections(response);
    }
  }, []);

  return (
    <div>
      <LoadScript googleMapsApiKey={CLE_API_GOOGLE}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
          {depart && destination && !directions && (
            <DirectionsService
              options={{
                origin: depart,
                destination: destination,
                travelMode: "DRIVING",
              }}
              callback={directionsCallback}
            />
          )}

          {directions && <DirectionsRenderer options={{ directions }} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
