import './App.css';
import React, {useState, useCallback} from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Geocode from 'react-geocode';
import { Descriptions } from 'antd';
import AutoComplete from 'react-google-autocomplete';

Geocode.setApiKey("AIzaSyAMQmkgHfqVwierkO-Ryo3UXEtFM9NO2dU");

function App() {
  const [map, setMap] = useState(null);
  
  const [marker, setMarker] = useState({lat: -34.397, lng: 150.644});
  const [mapPos, setMapPos] = useState({lat: -34.397, lng: 150.644});
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [state, setState] = useState('');

  const containerStyle = {
    width: '500px',
    height: '500px'
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAMQmkgHfqVwierkO-Ryo3UXEtFM9NO2dU"
  })

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const getCity = (addressArray) => {
    let city = '';
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };

  const getArea = (addressArray) => {
    let area = '';
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray.length; j++) {
          if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };

  const getState = (addressArray) => {
    let state = '';
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
          if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
            state = addressArray[i].long_name;
            return state;
          }
        }
    }
  };

  const onMarkerDragEnd = (e) => {
    let newLat = e.latLng.lat();
    let newLng = e.latLng.lng();

    Geocode.fromLatLng(newLat, newLng)
      .then(res => {
        const address = res.results[0].formatted_address,
          addressArray = res.results[0].address_components,
          city = getCity(addressArray),
          area = getArea(addressArray),
          state = getState(addressArray)
        
        setAddress((address) ? address : '');
        setArea((area) ? area : '');
        setCity((city) ? city : '');
        setState((state) ? state : '');
        setMapPos({lat: newLat, lng: newLng})
        setMarker({lat: newLat, lng: newLng})
    })
  }

  const onPlaceSelected = (place) => {
    
  }

  return isLoaded ? (
    <div style={{padding: '1rem', margin: '0 auto', maxWidth: 1000}}>
      <div > 
        <h1>Google Map Basic</h1>
      <Descriptions  layout="vertical" bordered>
          <Descriptions.Item label="City">{city}</Descriptions.Item>
          <Descriptions.Item label="Area">{area}</Descriptions.Item>
          <Descriptions.Item label="State">{state}</Descriptions.Item>
          <Descriptions.Item label="Address">{address}</Descriptions.Item>
      </Descriptions>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{lat: mapPos.lat, lng: mapPos.lng}}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker
          draggable={true}
          onDragEnd={onMarkerDragEnd}
          position={marker}>
          <InfoWindow>
            <div>{address}</div>
          </InfoWindow>
        </Marker>

      </GoogleMap>
      <AutoComplete
        apiKey={'AIzaSyAMQmkgHfqVwierkO-Ryo3UXEtFM9NO2dU'}
        style={{ width: '100%', height: '40px', paddingLeft: 16, marginTop: 2, marginBottom: '2rem'}}
        types={['(regions)']}
        onPlaceSelected={onPlaceSelected}
      />
 
    </div>
  ) : <></>
}

export default App;
