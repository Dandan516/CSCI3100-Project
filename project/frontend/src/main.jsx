import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Routes, Route } from 'react-router-dom';

import "@radix-ui/themes/styles.css";

import './index.css'
import * as Pages from './pages/index';
import AuthProvider from "./hooks/AuthProvider";
import PrivateRoute from "./router/PrivateRoute";
import { SettingsProvider } from "./hooks/SettingsProvider";

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
        {
          path: "/password-reset",
          element: <Pages.PasswordReset />,
        },
        
        // Private routes
        {
          element: <PrivateRoute />,
          children:
            [
              {
                path: "/start",
                element: <Pages.Start />,
              },
              {
                path: "/dashboard",
                element: <Pages.Dashboard />,
              },
              {
                path: "/profile",
                element: <Pages.Profile />,
              },
              {
                path: "/settings",
                element: <Pages.Settings />,
              },
              {
                path: "/calendar",
                element: <Pages.Calendar />,
              },
              {
                path: "/travel/*",
                children:
                  [
                    {
                      path: "*",
                      element: <Pages.TravelPlannerRoot />,
                    },
                    {
                      path: ":id",
                      element: <Pages.TravelPlanner />,
                    },
                  ]
              },
              {
                path: "/budget/*",
                children:
                  [
                    {
                      path: "*",
                      element: <Pages.BudgetTrackerRoot />,
                    },
                    {
                      path: ":id",
                      element: <Pages.BudgetTracker />,
                    }
                  ]
              }
            ]
        },
      ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SettingsProvider>
      <RouterProvider router={router} />
    </SettingsProvider>
  </StrictMode>,
)

