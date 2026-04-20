import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* Importación Modular (Arquitectura por Features) */
import StorePage from './features/catalogo/StorePage';
import CartPage from './features/ventas/CartPage';
import Checkout from './features/usuarios/Checkout';
import PaymentSupport from './features/soporte/PaymentSupport';
import Contact from './features/soporte/Contact';
import InventoryAdminPage from './features/inventario/InventoryAdminPage';
import OrdersAdminPage from './features/ventas/OrdersAdminPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StorePage />} />
                <Route path="/carrito" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/pago" element={<PaymentSupport />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/admin/inventario" element={<InventoryAdminPage />} />
                <Route path="/admin/pedidos" element={<OrdersAdminPage />} />
            </Routes>
        </Router>
    );
}

export default App;
