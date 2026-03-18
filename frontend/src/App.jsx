import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

/* Importación Modular (Arquitectura por Features) */
import Checkout from './features/usuarios/Checkout';
import PaymentSupport from './features/soporte/PaymentSupport';
import Contact from './features/soporte/Contact';

/* Diseño Global (Design Tokens) */


// Pantalla de Inicio (Dashboard de Módulos)
const Home = () => (
  <div className="app-container">
    <header style={{ marginBottom: '40px', textAlign: 'center' }}>
      <img 
        src="/logo_lalico.jpeg" 
        alt="Logo LaLico Oficial" 
        style={{ width: '120px', borderRadius: '50%', marginBottom: '20px', boxShadow: '0 0 30px rgba(57, 181, 74, 0.2)' }} 
      />
      <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-green)', letterSpacing: '2px' }}>LA LICO</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ecosistema Premium • Frontend Modular</p>
    </header>

    <div className="glass-card" style={{ marginBottom: '40px', padding: '30px' }}>
      <h3 style={{ marginBottom: '15px' }}>🚀 Módulo Usuarios & Soporte</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
         <div style={{ background: 'var(--surface-2)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--primary-green)' }}>●</span> Identificación
         </div>
         <div style={{ background: 'var(--surface-2)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--primary-green)' }}>●</span> Pago (HU 6)
         </div>
         <div style={{ background: 'var(--surface-2)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--primary-green)' }}>●</span> Direcciones
         </div>
         <div style={{ background: 'var(--surface-2)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--primary-green)' }}>●</span> Contacto
         </div>
      </div>
    </div>

    <div style={{ display: 'grid', gap: '15px' }}>
      <Link to="/checkout" className="btn-primary">📦 Ir al Checkout</Link>
      <Link to="/contacto" className="btn-primary" style={{ background: 'var(--surface-2)', color: 'white' }}>🏢 Info Tienda & Soporte</Link>
    </div>

    <footer style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.8rem', opacity: '0.5' }}>
       Versión Modular Proyectada • 2026 LaLico Medellín
    </footer>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pago" element={<PaymentSupport />} />
        <Route path="/contacto" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
