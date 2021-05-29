import './App.css';
import React, {useState, useCallback} from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

function App() {

  const containerStyle = {
    width: '500px',
    height: '500px'
  };
  
  const center = {
    lat: -34.397,
    lng: 150.644
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAMQmkgHfqVwierkO-Ryo3UXEtFM9NO2dU"
  })

  const [map, setMap] = useState(null)

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={center}>
        <InfoWindow>
          <div>hello</div>
        </InfoWindow>
      </Marker>
    </GoogleMap>
  ) : <></>
}

export default App;
