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
import Login from "./Login";
// Experimental: import empty service worker for PWA
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

let locId = [49, 115, 39, 91, 78, 110, 118, 141, 69, 164, 16, 19, 48, 54, 67];

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
      <div style={{ position: "fixed", height: "90%", width: "20%", top: "10%" }} className="btn-group-vertical">
        <Link className="btn btn-secondary rounded-0 border border-primary " to="/home">Home</Link>
        <Link className="btn btn-secondary rounded-0 border border-primary" to="/locations">All Locations</Link>
        <Link className="btn btn-secondary rounded-0 border border-primary" to="/favlocations">Favourite Locations</Link>
        <Link className="btn btn-secondary rounded-0 border border-primary" to="/logout">Logout</Link>
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
  for (let i = 0; i < locId.length; i++) {
    var url = "http://localhost:8000/location/" + locId[i];
    fetch(url)
      .then((response) => {
        response.json()
      })
      .then((data) => {
        for (let i = 0; i < 15; i++) {
          let obj = { latitude: data[locId[i] - 1].latitude, longtitude: data[locId[i] - 1].longtitude };
          loc.push(obj);
        }
      })
  }
  console.log(loc);
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
  let loc = [];
  fetch("http://localhost:8000/locations")
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < 15; i++) {
        let obj = { id: i, name: data[locId[i] - 1].name, min: data[locId[i] - 1].minTrafficSpeed, max: data[locId[i] - 1].maxTrafficSpeed };
        loc.push(obj);
      }
    })
  //
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
  return (
    <div>
      <input id="searchBar" style={{ position: "absolute", right: "2%", top: "12%" }} type="text" onKeyUp={Filter} placeholder="Search for Road Names"></input>
      <table id="locations" style={{ position: "fixed", top: "20%", left: "20%", width: "80%" }} className="table">
        <thead>
          <tr>
            <th scope="col">Location ID</th>
            <th scope="col">Road name</th>
            <th scope="col">Minimum Speed (km/h)</th>
            <th scope="col">Maximum Speed (km/h)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>CONNAUGHT ROAD CENTRAL</td>
            <td>41</td>
            <td>47.8</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>SALISBURY ROAD</td>
            <td>49</td>
            <td>50</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>CHATHAM ROAD NORTH</td>
            <td>45.2</td>
            <td>52</td>
          </tr>
          {loc.map((loc) => {
            return (
              <tr>
                <th scope="row">{loc.id}</th>
                <td>{loc.name}</td>
                <td>{loc.min}</td>
                <td>{loc.max}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function FavLocations() {
  // Load Location for Table
  let loc = [];
  fetch("http://localhost:8000/locations")
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < 15; i++) {
        let obj = { id: i, name: data[locId[i] - 1].name, min: data[locId[i] - 1].minTrafficSpeed, max: data[locId[i] - 1].maxTrafficSpeed };
        loc.push(obj);
        console.log(obj)
      }
    })
  return (
    <div>
      <table id="locations" style={{ position: "fixed", top: "20%", left: "20%", width: "80%" }} className="table">
        <thead>
          <tr>
            <th scope="col">Location ID</th>
            <th scope="col">Road name</th>
            <th scope="col">Minimum Speed (km/h)</th>
            <th scope="col">Maximum Speed (km/h)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">3</th>
            <td>CHATHAM ROAD NORTH</td>
            <td>45.2</td>
            <td>52</td>
          </tr>
          <tr>
            <th scope="row">4</th>
            <td>LUNG CHEUNG ROAD</td>
            <td>41</td>
            <td>47.8</td>
          </tr>
          <tr>
            <th scope="row">5</th>
            <td>JOCKEY CLUB ROAD</td>
            <td>43.1</td>
            <td>68</td>
          </tr>

          {loc.map((loc) => {
            return (
              <tr>
                <th scope="row">{loc.id}</th>
                <td>{loc.name}</td>
                <td>{loc.min}</td>
                <td>{loc.max}</td>
              </tr>
            );
          })}
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
