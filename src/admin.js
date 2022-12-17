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
import axios, * as others from 'axios';
import { response } from 'express';

//import Login from "./Login";
// Experimental: import empty service worker for PWA
//import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

let locId = [49, 115, 39, 91, 78, 110, 118, 141, 69, 164, 16, 19, 48, 54, 67];

export default function Admin() {
  return (
    <div>
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

      <div style={{ position: "fixed", height: "90%", width: "20%", top: "10%" }} className="bg-secondary">
                <button style={{ height: "10%", width: "100%" }}  className="btn btn-secondary rounded-0 border border-primary">Home</button>
                <button style={{ height: "10%", width: "100%" }} onClick={CreateLocation} className="btn btn-secondary rounded-0 border border-primary">Create Location</button>
                <button style={{ height: "10%", width: "100%" }} onClick={ReadLocation} className="btn btn-secondary rounded-0 border border-primary">Read Location</button>
                <button style={{ height: "10%", width: "100%" }} onClick={UpdateLocation} className="btn btn-secondary rounded-0 border border-primary">Update Location</button>
                <button style={{ height: "10%", width: "100%" }} onClick={DeleteLocation} className="btn btn-secondary rounded-0 border border-primary">Delete Location</button>
                <button style={{ height: "10%", width: "100%" }} onClick={CreateUser} className="btn btn-secondary rounded-0 border border-primary">Create User</button>
                <button style={{ height: "10%", width: "100%" }} onClick={ReadUser} className="btn btn-secondary rounded-0 border border-primary">Read User</button>
                <button style={{ height: "10%", width: "100%" }} onClick={UpdateUser} className="btn btn-secondary rounded-0 border border-primary">Update User</button>
                <button style={{ height: "10%", width: "100%" }} onClick={DeleteUser} className="btn btn-secondary rounded-0 border border-primary">Delete User</button>
            </div>
           <UpdateLocation/>
           
            </div>
  );
}

// function Home() {
//   const containerStyle = {
//     width: "80vw",
//     height: "90vh",
//   };
//   const center = {
//     lat: 22.356311,
//     lng: 114.124516
//   };
//   const zoomSize = 11;
//   const { isLoaded } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: "AIzaSyAe0TdcYNRvHTpj6kL12M3Zbwf_v8WkD8o"
//   });
//   const [map, setMap] = React.useState(null)
//   const onLoad = React.useCallback(function callback(map) {
//     setMap(map)
//   }, [])
//   const onUnmount = React.useCallback(function callback(map) {
//     setMap(null)
//   }, [])
//   // Load Location for Marker
//   let loc = [];
//   for (let i = 0; i < locId.length; i++) {
//     var url = "http://localhost:80/location/" + locId[i];
//     fetch(url)
//       .then((response) => {
//         response.json()
//       })
//       .then((data) => {
//         for (let i = 0; i < 15; i++) {
//           let obj = { latitude: data[locId[i] - 1].latitude, longtitude: data[locId[i] - 1].longtitude };
//           loc.push(obj);
//         }
//       })
//   }
//   console.log(loc);
//   // Load Google Map
//   return isLoaded ? (
//     <div style={{ position: "absolute", right: "0", bottom: "0" }}>
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={zoomSize}
//         onLoad={onLoad}
//         onUnmount={onUnmount}>
//         <Marker position={{ lat: 22.356311, lng: 114.124516 }}></Marker>
//         {loc.map((loc) => {
//           // Place Marker on Map
//           return (<Marker position={{ lat: loc.latitude, lng: loc.longtitude }}></Marker>);
//         })}
//       </GoogleMap>
//     </div >
//   ) : <></>
// }

// create location post form
class CreateLocation extends React.Component {
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
    axios.post('http://localhost:80/admin/add/location', this.state)
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
    axios.post('http://localhost:80/admin/add/location', this.state)
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
    this.state = { locID: ""}
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  submitHandler = (e) => {
    e.preventDefault()
    console.log(this.state)

    axios.get('http://localhost:80/admin/location/'+this.state.locID, {parmas:{locID : this.state.locID}})
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })
  }
  render() {
    const { locID } = this.state
    return (
      <>
        <div style={{position: "absolute", left: "22%", top: "12%" }}>
          <form onSubmit={this.submitHandler} >
            <label>
              Location ID:
              <input type="text" name="locID" value={locID} onChange={this.changeHandler} />
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
    this.state = { userID: '' }
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })

  }
  submitHandler = (e) => {
    e.preventDefault()
    console.log(this.state)
    axios.get('http://localhost:8080/admin/user/'+this.state.userID, {parmas:{userID : this.state.userID}})
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })
  }

  render() {
    const { userID } = this.state
    return (
      <>
        <div style={{position: "absolute", left: "22%", top: "12%" }}>
          <form onSubmit={this.submitHandler} action="/admin/location/:locID" method="Get">
            <label>
              User ID:
              <input type="text" name="userID" value={userID} onChange={this.changeHandler} />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>


      </>



    )
  }
}


class UpdateLocation extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      locID: '',
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
  loadHandler = (e) => {
    axios.get('http://localhost:80/admin/location/'+this.state.locID, {parmas:{locID : this.state.locID}})
    .then(response =>{
      this.setState({ name : response.name })
      this.setState({ latitude : response.latitude})
      this.setState({ longtitude : response.longtitude})
      this.setState({maxTrafficSpeed : response.maxTrafficSpeed})
      this.setState({ minTrafficSpeed : response.minTrafficSpeed})

})
    .catch(error =>{
      console.log(error)
    })
  }
  submitHandler = (e) => {
    e.preventDefault()
    console.log(this.state)
    axios.post('http://localhost:80/admin/add/location', this.state)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  }
  render() {
    const { locID, name, latitude, longtitude, maxTrafficSpeed, minTrafficSpeed } = this.state
    return (
      <div style={{position: "absolute", left: "22%", top: "12%" }}>
        <form onSubmit={this.submitHandler}>
          
        <div>
            <label>LocationId for fetching data
              <input type="text" name="locID" value={locID} onChange={this.changeHandler}/>
            </label>
          </div>

          <button type="button " onClick={this.loadHandler}>Load</button>
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

class UpdateUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userID: '',
      username: '',
      password: '',

    }
    
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  loadHandler = (e) => {
    axios.get('http://localhost:80/admin/user/'+this.state.userID, {parmas:{locID : this.state.userID}})
    .then(response =>{
      this.setState({ username : response.username })
      this.setState({ password : response.password})
   })
   .catch(error => {
    console.log(error)
  })
  
  
  }

  submitHandler = (e) => {
    e.preventDefault()
    console.log(this.state)

    axios.put('http://localhost:80/admin/update/user/' + this.state.userId, {parmas:{locID : this.state.userID}})
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })

  }
  render() {
    const { userID, password, username } = this.state
    return (
      
        <div style={{position: "absolute", left: "22%", top: "12%" }}>

          <form onSubmit={this.submitHandler} >
          
            <label>userId for fetching data
              <input type="text" name="userID" value={userID} onChange={this.changeHandler}/>
            </label>
          

          <button type="button " onClick={this.loadHandler}>Load</button>
            <label>
              User name you want to :
              <input type="text" name="locID" value={username} onChange={this.changeHandler} />
            </label>
            <label>
             Password you want to update:
              <input type="text" name="password" value={password} onChange={this.changeHandler} />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>

  



    )
  }
}




class  DeleteLocation extends React.Component {
  constructor(props) {
    super(props)
    this.state = { locID: ""}
    
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  submitHandler = (e) => {
    e.preventDefault()
    console.log(this.state)

    axios.delete('http://localhost:80/admin/delete/location/'+this.state.locID, {parmas:{locID : this.state.locID}})
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })

  }
  render() {
    const { locID } = this.state
    return (
      <>
        <div style={{position: "absolute", left: "22%", top: "12%" }}>
          <form onSubmit={this.submitHandler} >
            <label>
              Location ID you want to delete:
              <input type="text" name="locID" value={locID} onChange={this.changeHandler} />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>

   
      </>



    )
  }
}

class DeleteUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = { userID: ""}
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  submitHandler = (e) => {
    e.preventDefault()
    console.log(this.state)

    axios.delete('http://localhost:80/admin/delete/location/'+this.state.userID, {parmas:{locID : this.state.userID}})
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })
  }
  render() {
    const { userID } = this.state
    return (
      <>
        <div style={{position: "absolute", left: "22%", top: "12%" }}>
          <form onSubmit={this.submitHandler} >
            <label>
              User ID you want to delete:
              <input type="text" name="userID" value={userID} onChange={this.changeHandler} />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>


      </>
    )
  }
}
