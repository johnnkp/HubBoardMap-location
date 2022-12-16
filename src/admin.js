/* PROGRAMMER:
 * Mok Chau Wing (1155142763)
 * Chan Shi Leung Jonathan (1155142863)
 * Li Tsz Yeung (1155144367)
 * Ng Kai Pong (1155144829)
 * Lee Yat Him (1155176301)
 * Lin Chun Man (1155177065)
*/
import ReactDOM from 'react-dom/client';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter, Routes, Route, Link,
  useMatch, useParams, useLocation
} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Axios } from 'axios';

//import Login from "./Login";
// Experimental: import empty service worker for PWA
//import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

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
            <Button>@admin</Button>
          </Navbar.Brand>
        </Container>
      </Navbar>
      {/* Vertical Navigation Bar */}
      <div style={{ position: "fixed", height: "90%", width: "20%", top: "10%" }} className="btn-group-vertical">
        <Link className="btn btn-secondary rounded-0 border border-primary" to="/admin/home">Home</Link>
        <Link className="btn btn-secondary rounded-0 border border-primary" to="/admin/location_create">Create Location</Link>
        <Link className="btn btn-secondary rounded-0 border border-primary" to="/admin/location_read">Read Location</Link>
        <Link className="btn btn-secondary rounded-0 border border-primary" to="/admin/location_update">Update Location</Link>
        <Link className="btn btn-secondary rounded-0 border border-primary" to="/admin/location_delete">Delete Location</Link>
        <Link className="btn btn-secondary rounded-0 border border-primary" to="/admin/user_create">Create User</Link>
        <Link className="btn btn-secondary rounded-0 border border-primary" to="/admin/user_read">Read User</Link>
        <Link className="btn btn-secondary rounded-0 border border-primary" to="/admin/user_update">Update User</Link>
        <Link className="btn btn-secondary rounded-0 border border-primary" to="/admin/user_delete">Delete User</Link>
        <Link className="btn btn-secondary rounded-0 border border-primary" to="/logout">Logout</Link>
      </div>
      <Routes>
        <Route path="/admin/home" element={<Home />} />
        <Route path="/admin/location_create" element={<CreateLocation />} />
        <Route path="/admin/location_read" element={<ReadLocation />} />
        <Route path="/admin/user_create" element={<CreateUser/>} />
        <Route path="/admin/user_read" element={<ReadUser />} />
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

// create location post form
export class CreateLocation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      latitude: '',
      longtitude: '',
      maxTrafficSpeed: '',
      minTrafficSpeed: ''
    }
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  submitHandler = (e) => {
    e.preventDefault()
    console.log(this.state)
    Axios.post('http://localhost:3000/admin/add/location', this.state)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  }
  render() {
    const { name, latitude, longtitude, maxTrafficSpeed, minTrafficSpeed } = this.state
    return (
      <div style={{position: "absolute", left: "22%", top: "12%" }}>
        <form onSubmit={this.submitHandler}>
          <div>
            <label>
              Name: 
              <input type="text" name="name" value={name} onChange={this.changeHandler} />
            </label>
          </div>
          <div>
            <label>
              Latitude: 
              <input type="text" name="latitude" value={latitude} onChange={this.changeHandler} />
            </label>
          </div>
          <div>
            <label>Longtitude:
              <input type="text" name="longtitude" value={longtitude} onChange={this.changeHandler} />
            </label>
          </div>
          <div>
            <label>MaxTrafficSpeed:
              <input type="text" name="maxTrafficSpeed" value={maxTrafficSpeed} onChange={this.changeHandler} />
            </label>
          </div>
          <div>
            <label>MinTrafficSpeed:
              <input type="text" name="minTrafficSpeed" value={minTrafficSpeed} onChange={this.changeHandler} />
            </label>
          </div>

          <button type="submit">Submit</button>

        </form>

      </div>


    )
  }
}


class CreateUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',

    }
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  submitHandler = (e) => {
    e.preventDefault()
    console.log(this.state)
    Axios.post('http://localhost:3000/admin/add/location', this.state)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  }
  render() {
    const { username, password } = this.state
    return (
      <div style={{position: "absolute", left: "22%", top: "12%" }}>
        <form onSubmit={this.submitHandler}>
          <div>
            <label>
              Username:
              <input type="text" name="username" value={username} onChange={this.changeHandler} />
            </label>
          </div>
          <div>
            <label>
              Password:
              <input type="text" name="password" value={password} onChange={this.changeHandler} />
            </label>
          </div>


          <button type="submit">Submit</button>

        </form>

      </div>


    )
  }
}


class ReadLocation extends React.Component {
  constructor(props) {
    super(props)
    this.state = { locId: '' }
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  submitHandler = (e) => {
    e.preventDefault()
    console.log(this.state)
  }

  render() {
    const { locId } = this.state
    return (
      <>
        <div style={{position: "absolute", left: "22%", top: "12%" }}>
          <form onSubmit={this.submitHandler} action="http://localhost:3000//admin/location/:locID" method="GET">
            <label>
              Location ID:
              <input type="text" name="locId" value={locId} onChange={this.changeHandler} />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>


      </>



    )
  }
}


class ReadUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = { userId: '' }
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  submitHandler = (e) => {
    e.preventDefault()
    console.log(this.state)
  }

  render() {
    const { userId } = this.state
    return (
      <>
        <div style={{position: "absolute", left: "22%", top: "12%" }}>
          <form onSubmit={this.submitHandler} action="/admin/location/:locID" method="Get">
            <label>
              User ID:
              <input type="text" name="userId" value={userId} onChange={this.changeHandler} />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>


      </>



    )
  }
}
const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Experimental: register service worker
// serviceWorkerRegistration.register();
