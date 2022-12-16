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
import HubBoardIcon from "./HubBoardMap.svg";
import loginMainCSS from "./login/css/main.css"
import loginUtilCSS from "./login/css/util.css"
import "./bootstrap.scheme.css"

export default function Login() {
    // https://colorlib.com/wp/template/login-form-v5/
    // https://www.freecodecamp.org/news/react-background-image-tutorial-how-to-set-backgroundimage-with-inline-css-style
    return <div className="container-login100" style={{backgroundImage: `url(${loginBackground})`}}>
        <div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
            <form className="login100-form validate-form flex-sb flex-w"
                  action="http://localhost:80/login" method="post">
                <div className="d-flex align-items-center w-100 pb-5">
                    <img src={HubBoardIcon} width="75" height="75"/>
                    <span className="login100-form-title">
						HubBoard Map Login
					</span>
                </div>
                <label htmlFor="username" className="h5">Username</label>
                <br/>
                <div className="wrap-input100 validate-input" data-validate="Username is required">
                    <input className="input100" type="text" id="username" name="username"/>
                    <span className="focus-input100"></span>
                </div>

                <label htmlFor="password" className="h5 pt-5">Password</label>
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