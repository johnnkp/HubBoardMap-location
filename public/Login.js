
import React from 'react'
import { Form, Button } from "react-bootstrap";
import  { useState } from 'react';
import axios from "axios";



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);
const handleSubmit = (e) => {// set configurations
  const configuration = {
    method: "post",
    url: "https://nodejs-mongodb-auth-app.herokuapp.com/login",
    data: {
      email,
      password,
    },
  };

  // prevent the form from refreshing the whole page
  e.preventDefault();
  axios(configuration)
  .then((result) => {console.log(result);})
  .catch((error) => {console.log(error);})

  alert("Submited");
}
    return (
        <>
          <h2>Login</h2>
     
        <Form onSubmit={(e)=>handleSubmit(e)}>
        {/* email */}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </Form.Group>

        {/* password */}
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>

        {/* submit button */}
        <Button
          variant="primary"
          type="submit"
          onClick={(e) => handleSubmit(e)}
           >
          Login
        </Button>
      </Form>
        </>
    )
}