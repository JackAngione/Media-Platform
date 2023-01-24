import * as React from "react";
import ReactPlayer from 'react-player'
import "./homepage.css";
import Login from "./routes/login"
import {BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";
import {invoke} from "@tauri-apps/api/tauri";
import {useState} from "react";

const Homepage = () => {

    return (
        <>
            <div id="container">
                <h1>HomePage</h1>
                <ReactPlayer url="https://youtu.be/E7sP6t1QyrI" controls/>
            </div>
            <input
                id="userNameInput"
                onChange={(e) => setUserName(e.currentTarget.value)}
                placeholder="username!!"
            />

        </>
    );
}
export default Homepage;