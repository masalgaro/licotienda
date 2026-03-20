import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './shared/design-system.css'
import App from './App.jsx'
import { CartProvider } from './shared/CartContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
)
