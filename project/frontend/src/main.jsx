import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Theme, ThemePanel } from "@radix-ui/themes";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Theme className="theme" accentColor="indigo" grayColor="slate" radius="full" scaling="100%" appearance="dark"> 
      <App />
    </Theme>
  </StrictMode>,
)
