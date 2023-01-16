import React from "react";
import ReactPlayer from 'react-player'
import "./homepage.css";
//import Login from "./login"
import {BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";


const Homepage = () => {

    return (
        <>
            <div id="container">
                <h1>Page Title</h1>
                <ReactPlayer url="https://youtu.be/E7sP6t1QyrI" controls/>
            </div>
        </>
    );
}

export default Homepage;
