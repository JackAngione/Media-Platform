import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Homepage from "./homepage";
import Login from "./routes/login";
import UserPage from "./routes/userPage";
import UploadPage from "./routes/uploadREGULAR.jsx";
import "./style.css";
import NavigationBar from "./navigation.jsx";
import Logout from "./routes/logout.jsx";
import CreateAccount from "./routes/createAccount.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <BrowserRouter>
          <NavigationBar/>
          <Routes>
              <Route path ="/" element={<Homepage/>} />
              <Route path ="login" element={<Login/>} />
              <Route path ="logout" element={<Logout/>} />
              <Route path="create_account" element={<CreateAccount/>}/>
              <Route path ="user/:userID" element={<UserPage/>} />
              <Route path ="upload" element={<UploadPage/>} />
          </Routes>
      </BrowserRouter>
  </React.StrictMode>
);