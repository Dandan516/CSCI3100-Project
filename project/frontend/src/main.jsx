import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Routes, Route } from 'react-router-dom';
import { Theme } from "@radix-ui/themes";

import './index.css'
import * as Pages from './pages/index';
import AuthProvider from "./hooks/AuthProvider";
import PrivateRoute from "./router/PrivateRoute";

const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    errorElement: <Pages.NotFound />,
    children:
      [
        {
          path: "/",
          element: <Pages.Portal />,
        },
        {
          path: "/signup",
          element: <Pages.SignUp />,
        },
        {
          path: "/forgot-password",
          element: <Pages.ForgotPassword />,
        },
        {
          path: "/login",
          element: <Pages.Login />,
        },
        // protected routes
        {
          element: <PrivateRoute />,
          children:
            [
              {
                path: "/home",
                element: <Pages.Home />,
              },
              {
                path: "/profile",
                element: <Pages.Profile />,
              },
              {
                path: "/travel/*",
                children:
                  [
                    {
                      path: "*",
                      element: <Pages.TravelPlannerHome />,
                    },
                    {
                      path: ":id",
                      element: <Pages.TravelPlanner />,
                    },
                  ]
              },
            ]
        },
      ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Theme className="theme" accentColor="indigo" grayColor="slate" radius="full" scaling="100%" appearance="dark">
      <RouterProvider router={router} />
    </Theme>
  </StrictMode>,
)

