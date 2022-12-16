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

function App() {
  return (
    <BrowserRouter>
      {/* Horizontal Navigation Bar */}
      <Navbar style={{ position: "fixed", height: "10%", width: "100%" }} id="navBar" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            CSCI2720 Group 12
          </Navbar.Brand>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          <Navbar.Brand>
            <Button>Username</Button>
          </Navbar.Brand>
        </Container>
      </Navbar>
      {/* Vertical Navigation Bar */}
      <div style={{ position: "fixed", height: "90%", width: "20%", top: "10%" }} className="btn-group-vertical">
        <Link className="btn btn-secondary rounded-0" to="/home">Home</Link>
        <Link className="btn btn-secondary rounded-0" to="/locations">All Locations</Link>
        <Link className="btn btn-secondary rounded-0" to="/favlocations">Favourite Locations</Link>
        <Link className="btn btn-secondary rounded-0" to="/logout">Logout</Link>
      </div>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/locations" element={<Location />} />
        <Route path="/favlocations" />
        <Route path="/logout" />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div>
      <iframe id="map" title="map" style={{ position: "fixed", right: "0", bottom: "0", height: "90%", width: "80%", border: "0" }}
        src="https://www.google.com/maps/embed/v1/view?key=AIzaSyAe0TdcYNRvHTpj6kL12M3Zbwf_v8WkD8o
        &center=22.356311, 114.124516&zoom=11">
      </iframe>
    </div >
  );
}

function Location() {
  let loc = [];
  fetch("http://localhost:8000/locations")
    .then((response) => response.json())
    .then((data) => {
      let locId = [49, 115, 39, 91, 78, 110, 118, 141, 69, 164, 16, 19, 48, 54, 67];
      for (let i = 0; i < 15; i++) {
        loc.push({ id: i, name: data[locId[i] - 1].name, min: data[locId[i] - 1].minTrafficSpeed, max: data[locId[i] - 1].maxTrafficSpeed });
      }
    })
  console.log(loc);
  return (
    <table id="locations" style={{ position: "fixed", top: "10%", left: "20%" }} className="table">
      <thead>
        <tr>
          <th scope="col">Location ID</th>
          <th scope="col">Road name</th>
          <th scope="col">Minimum Speed (km/h)</th>
          <th scope="col">Maximum Speed (km/h)</th>
        </tr>
      </thead>
      <tbody>
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
