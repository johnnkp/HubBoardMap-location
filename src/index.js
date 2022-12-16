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
      <div style={{ position: "fixed", height:"90%", width: "20%", top: "10%" }} className="btn-group-vertical">
        <button className="btn rounded-0">
          <Link to="/">Home</Link>
        </button>
        <button className="btn rounded-0">
          <Link to="/locations">All Locations</Link>
        </button>
        <button className="btn rounded-0">
          <Link to="/favlocations">Favourites Locations</Link>
        </button>
        <button className="btn rounded-0">
          <Link to="/logout">Logout</Link>
        </button>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div>
      <iframe style={{ position: "fixed", right: "0", bottom: "0", height: "90%", width: "80%", border: "0" }}
              frameBorder="0" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed/v1/view?key=AIzaSyAe0TdcYNRvHTpj6kL12M3Zbwf_v8WkD8o
        &center=22.356311, 114.124516&zoom=11" allowFullScreen>
      </iframe>
    </div >
  );
}

function Location() {
  return (
    <table>

    </table>
  );
}

function NoMatch() {
  let location = useLocation();
  return (
    <div>
      <h3>
        No match for:
        <br></br>
        <code>{location.pathname}</code>
      </h3>
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
