import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* Importación Modular (Arquitectura por Features) */
import StorePage from './features/catalogo/StorePage';
import GranizadoBuilder from './features/catalogo/GranizadoBuilder';
import CartPage from './features/ventas/CartPage';
import Checkout from './features/usuarios/Checkout';
import AdminLoginPage from './features/usuarios/AdminLoginPage';
import PaymentSupport from './features/soporte/PaymentSupport';
import Contact from './features/soporte/Contact';
import InventoryAdminPage from './features/inventario/InventoryAdminPage';
import OrdersAdminPage from './features/ventas/OrdersAdminPage';
import PrivateRoute from './shared/PrivateRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StorePage />} />
                <Route path="/armar-granizado" element={<GranizadoBuilder />} />
                <Route path="/carrito" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/pago" element={<PaymentSupport />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/inventario" element={<PrivateRoute><InventoryAdminPage /></PrivateRoute>} />
                <Route path="/admin/pedidos" element={<PrivateRoute><OrdersAdminPage /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
