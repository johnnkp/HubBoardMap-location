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
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Login from "./Login";
// Experimental: import empty service worker for PWA
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

function App(props) {
    return (
        <BrowserRouter>
            <div>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/locations">Location</Link></li>
                    <li><Link to="/favlocations">Favourites</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                </ul>
            </div>
            <Login/>
            <Routes>
                <Route path="/"/>
                <Route path="*" element={<NoMatch/>}/>
            </Routes>
        </BrowserRouter>
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
        <App/>
    </React.StrictMode>
);

// Experimental: register service worker
serviceWorkerRegistration.register();
