import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import  { useState, useRef, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" 
integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" 
crossorigin="anonymous"></link>

export default function Seperate() {


return(

<>
<Container>
<div style={{fixed: "left"}}  bg="dark" variant="dark">
    <table className='table'>
        <tr>
            <td className='item'>Road</td>
            <td>Road name</td>
        </tr>
        <tr>
            <td className='item'>Max Speed</td>
            <td>100</td>

        </tr>
        <tr>
            <td className='item'>Min Speed </td>
            <td>50</td>
        </tr>
    </table>
    <div></div>
<div></div>
<form>
    <div class="mb-3">
      <label for="new-email" class="form-label" >Email address</label>
      <textarea type="email" class="form-control" id="new-email" placeholder="name@example.com"></textarea>
    </div>
    <div class="mb-3">
      <label for="new-comment" class="form-label">Comment</label>
      
      <textarea class="form-control" id="new-comment" rows="3"></textarea>
    
    
    </div>
    <div>
        <button type= "submit"> submit</button>
    </div>
</form>
</div>
</Container>
</>
)
};









