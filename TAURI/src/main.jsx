import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, createMemoryRouter, RouterProvider,} from "react-router-dom";
import Homepage from "./homepage";
import Root from "./routes/root";
import ErrorPage from "./routes/error-page.jsx";
import Login from "./routes/login";
import UserPage from "./routes/userPage";
import "./style.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "homepage",
                element: <Homepage/>
            },
            {
                path: "user/:userID",
                element: <UserPage/>
            },
        ],
    },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <RouterProvider router={router} />

  </React.StrictMode>
);
