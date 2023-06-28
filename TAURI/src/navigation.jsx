import * as React from "react";
import ReactPlayer from 'react-player'
import "./homepage.css";
import Login from "./routes/login"
import {BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";
import "./navigationBar.css"

export default function NavigationBar(){

    return (
        <>
            <nav className="navigation">
                <div className="navDropdown">
                    <Link className ="mainDropdown" >test</Link>
                    <div className="dropDownList">
                        <Link to="/login"> Login</Link>
                        <Link to="/"> test </Link>
                        <Link to="/"> test </Link>
                    </div>
                </div>
                |
                <li>
                    <Link to="/homepage"> HOME </Link>
                </li>
                |
                <div className="navDropdown">
                    <Link className ="mainDropdownResources">User</Link>
                    <div className="dropDownList">
                        <Link to="/upload">UPLOAD File</Link>
                        <Link to="/user/xxxxxxx">xxxxxx user page</Link>
                    </div>
                </div>
            </nav>


        </>
    );
}