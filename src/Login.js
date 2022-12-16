/* PROGRAMMER:
 * Mok Chau Wing (1155142763)
 * Chan Shi Leung Jonathan (1155142863)
 * Li Tsz Yeung (1155144367)
 * Ng Kai Pong (1155144829)
 * Lee Yat Him (1155176301)
 * Lin Chun Man (1155177065)
*/
import React from 'react'
import {Form, Button} from "react-bootstrap";
import {useState} from 'react';
import axios from "axios";
import loginBackground from "./login/images/bg-01.jpg";
import "./login/css/main.css"
import "./login/css/util.css"

export default function Login() {
    // https://colorlib.com/wp/template/login-form-v5/
    // https://www.freecodecamp.org/news/react-background-image-tutorial-how-to-set-backgroundimage-with-inline-css-style
    return <div className="container-login100" style={{backgroundImage: `url(${loginBackground})`}}>
        <div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
            <form className="login100-form validate-form flex-sb flex-w" action="http://localhost:80/login"
                  method="post">
					<span className="login100-form-title p-b-40">
						Login
					</span>

                <label htmlFor="username">Username</label>
                <br/>
                <div className="wrap-input100 validate-input" data-validate="Username is required">
                    <input className="input100" type="text" id="username" name="username"/>
                    <span className="focus-input100"></span>
                </div>

                <label htmlFor="password">Password</label>
                <br/>
                <div className="wrap-input100 validate-input" data-validate="Password is required">
                    <input className="input100" type="password" id="password" name="password"/>
                    <span className="focus-input100"></span>
                </div>

                <div className="container-login100-form-btn m-t-17">
                    <button className="login100-form-btn">
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    </div>;
}