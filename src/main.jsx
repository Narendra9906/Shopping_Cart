import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import ShoppingCartApp from './App.jsx'
import React from 'react'
import { resume } from 'react-dom/server'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShoppingCartApp />
  </StrictMode>
);

