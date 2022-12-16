/* PROGRAMMER:
 * Mok Chau Wing (1155142763)
 * Chan Shi Leung Jonathan (1155142863)
 * Li Tsz Yeung (1155144367)
 * Ng Kai Pong (1155144829)
 * Lee Yat Him (1155176301)
 * Lin Chun Man (1155177065)
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './bootstrap.scheme.css';
import {useState, useRef, useEffect} from 'react';
import Container from 'react-bootstrap/Container';

export default function Seperate() {


    return (

        <>
            <Container>
                <div style={{fixed: "left"}} bg="dark" variant="dark">
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
                            <td className='item'>Min Speed</td>
                            <td>50</td>
                        </tr>
                    </table>
                    <div></div>
                    <div></div>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="new-email" className="form-label">Email address</label>
                            <textarea type="email" className="form-control" id="new-email"
                                      placeholder="name@example.com"></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="new-comment" className="form-label">Comment</label>

                            <textarea className="form-control" id="new-comment" rows="3"></textarea>


                        </div>
                        <div>
                            <button type="submit"> submit</button>
                        </div>
                    </form>
                </div>
            </Container>
        </>
    )
};









