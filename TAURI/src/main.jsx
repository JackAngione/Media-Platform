import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Homepage from "./homepage";
import Root from "./routes/root";
import Login from "./routes/login";
import UserPage from "./routes/userPage";
import UploadPage from "./routes/uploadREGULAR.jsx";
import "./style.css";
import NavigationBar from "./navigation.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <BrowserRouter>
          <NavigationBar/>
          <Routes>
              <Route path ="/" element={<Root/>} />
              <Route path ="login" element={<Login/>} />
              <Route path ="homepage" element={<Homepage/>} />
              <Route path ="user/:userID" element={<UserPage/>} />
              <Route path ="upload" element={<UploadPage/>} />
          </Routes>
      </BrowserRouter>
  </React.StrictMode>
);
