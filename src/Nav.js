import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
export default function Nav() {


  return(
<>
<Navbar id="navBar" style={{ height:"50%"}} bg="dark" variant="dark">
        
        <Container>
        <Navbar.Brand >
           
           Welcome to our page
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
          <Navbar.Brand href="#home">
          
            <Button fixed="right" >Username</Button>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>






)}