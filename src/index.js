/* PROGRAMMER:
 * Mok Chau Wing (1155142763)
 * Chan Shi Leung Jonathan (1155142863)
 * Li Tsz Yeung (1155144367)
 * Ng Kai Pong (1155144829)
 * Lee Yat Him (1155176301)
 * Lin Chun Man (1155177065)
*/
import ReactDOM from 'react-dom/client';
import React, {useEffect, useState} from 'react';
import {
    BrowserRouter, Routes, Route, Link,
    useMatch, useParams, useLocation
} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Login from "./Login";
// Experimental: import empty service worker for PWA
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const locID = [49, 115, 39, 91, 78, 110, 118, 141, 69, 164, 16, 19, 48, 54, 67];

function App() {
  return (
    <BrowserRouter>
      {/* Horizontal Navigation Bar */}
      <Navbar style={{ position: "fixed", height: "10%", width: "100%" }} id="navBar" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            CSCI2720 Group 12
          </Navbar.Brand>
          <Navbar.Brand>
            <Button>@user1</Button>
          </Navbar.Brand>
        </Container>
      </Navbar>
      {/* Vertical Navigation Bar */}
      <div style={{ position: "fixed", height: "90%", width: "20%", top: "10%" }} className="bg-secondary">
        <Link style={{ height: "10%", width: "100%" }} className="btn btn-secondary rounded-0 border border-primary" to="/home">Home</Link>
        <Link style={{ height: "10%", width: "100%" }} className="btn btn-secondary rounded-0 border border-primary" to="/locations">All Locations</Link>
        <Link style={{ height: "10%", width: "100%" }} className="btn btn-secondary rounded-0 border border-primary" to="/favlocations">Favourite Locations</Link>
        <Link style={{ height: "10%", width: "100%" }} className="btn btn-secondary rounded-0 border border-primary" to="/logout">Logout</Link>
      </div>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/favlocations" element={<FavLocations />} />
        <Route path="/logout" />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  const containerStyle = {
    width: "80vw",
    height: "90vh",
  };
  const center = {
    lat: 22.356311,
    lng: 114.124516
  };
  const zoomSize = 11;
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAe0TdcYNRvHTpj6kL12M3Zbwf_v8WkD8o"
  });
  const [map, setMap] = React.useState(null)
  const onLoad = React.useCallback(function callback(map) {
    setMap(map)
  }, [])
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])
  // Load Location for Marker
  let loc = [];
  for (let i = 0; i < locID.length; i++) {
    var url = "http://localhost:8080/location/" + locID[i];
    fetch(url)
      .then((response) => {
        response.json()
      })
      .then((data) => {
        for (let i = 0; i < locID.length; i++) {
          let obj = { latitude: data[locID[i] - 1].latitude, longtitude: data[locID[i] - 1].longtitude };
          loc.push(obj);
        }
      })
  }
  // Load Google Map
  return isLoaded ? (
    <div style={{ position: "absolute", right: "0", bottom: "0" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoomSize}
        onLoad={onLoad}
        onUnmount={onUnmount}>
        <Marker position={{ lat: 22.356311, lng: 114.124516 }}></Marker>
        {loc.map((loc) => {
          // Place Marker on Map
          return (<Marker position={{ lat: loc.latitude, lng: loc.longtitude }}></Marker>);
        })}
      </GoogleMap>
    </div >
  ) : <></>
}

function Locations() {
  // Load Location for Table
  let loc = [
    {
      ID: 1,
      name: "CONNAUGHT ROAD CENTRAL",
      min: 41,
      max: 47.8
    },
    {
      ID: 2,
      name: "SALISBURY ROAD",
      min: 49,
      max: 50
    },
    {
      ID: 3,
      name: "CHATHAM ROAD NORTH",
      min: 45.2,
      max: 52
    }];
  fetch("http://localhost:8080/locations")
    .then((response) => {
      response.json();
    })
    .then((data) => {
      for (let i = 0; i < locID.length; i++) {
        const temp = locID[i] - 1;
        const obj = { id: i, name: data[temp].name, min: data[temp].minTrafficSpeed, max: data[temp].maxTrafficSpeed };
        console.log(obj);
        loc.push(obj);
      }
    })
  const DisplayData = loc.map(
    (loc) => {
      return (
        <tr>
          <th>{loc.ID}</th>
          <td>{loc.name}</td>
          <td>{loc.min}</td>
          <td>{loc.max}</td>
        </tr>
      )
    }
  )
  // Search Function
  function Filter() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.querySelector("#searchBar");
    filter = input.value.toUpperCase();
    table = document.querySelector("#locations");
    tr = table.querySelectorAll("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].querySelectorAll("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
  // Sort Function
  let sortDirection = false;
  function sortColumn(columnName) {
    sortDirection = !sortDirection;
    loc = loc.sort((p1, p2) => sortDirection ? p1[columnName] - p2[columnName] : p2[columnName] - p1[columnName]);
  }
  return (
    <div>
      <input id="searchBar" style={{ position: "absolute", right: "2%", top: "12%" }} type="text" onKeyUp={Filter} placeholder="Search for Road Names"></input>
      <table id="locations" style={{ position: "fixed", top: "20%", left: "20%", width: "80%" }} className="table sortable">
        <thead>
          <tr>
            <th scope="col">Location ID</th>
            <th scope="col">Road name</th>
            <th scope="col" onClick={sortColumn("min")}>Minimum Speed (km/h)</th>
            <th scope="col" onClick={sortColumn("max")}>Maximum Speed (km/h)</th>
          </tr>
        </thead>
        <tbody>
          {DisplayData}
        </tbody>
      </table>
    </div>
  );
}

function FavLocations() {
  // Load Location for Table
  let loc = [
    {
      ID: 3,
      name: "CHATHAM ROAD NORTH",
      min: 45.2,
      max: 52
    },
    {
      ID: 4,
      name: "LUNG CHEUNG ROAD",
      min: 41,
      max: 47.8
    },
    {
      ID: 5,
      name: "JOCKEY CLUB ROAD",
      min: 43.1,
      max: 68
    }];
  fetch("http://localhost:8080/locations")
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < locID.length; i++) {
        let obj = { id: i, name: data[locID[i] - 1].name, min: data[locID[i] - 1].minTrafficSpeed, max: data[locID[i] - 1].maxTrafficSpeed};
        loc.push(obj);
      }
    })
  const DisplayData = loc.map(
    (loc) => {
      return (
        <tr>
          <th>{loc.ID}</th>
          <td>{loc.name}</td>
          <td>{loc.min}</td>
          <td>{loc.max}</td>
        </tr>
      )
    }
  )
  return (
    <div>
      <table id="locations" style={{ position: "fixed", top: "20%", left: "20%", width: "80%" }} className="table sortable">
        <thead>
          <tr>
            <th scope="col">Location ID</th>
            <th scope="col">Road name</th>
            <th scope="col">Minimum Speed (km/h)</th>
            <th scope="col">Maximum Speed (km/h)</th>
          </tr>
        </thead>
        <tbody>
          {DisplayData}
        </tbody>
      </table>
    </div>
  );
}

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Experimental: register service worker
serviceWorkerRegistration.register();
