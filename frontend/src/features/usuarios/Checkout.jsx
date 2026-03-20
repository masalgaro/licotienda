import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../shared/CartContext';

const Checkout = () => {
  const { cart, total } = useCart();
  const navigate = useNavigate();
  const [telefono, setTelefono] = useState('+57 ');
  const [metodoPago, setMetodoPago] = useState('efectivo');

  const envioCost = 6000;
  const finalTotal = total + envioCost;

  return (
    <div className="app-container">
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuQc3HlyttiwwCCXeXyirP3YbN6Jsw-Hn65rqG72dT17Dp1d9llZnDXFkooKHn0Ci1XLNzPtue3TSsCzDRID7rZDtEoP-H_Holbo_avbnKAAg79Ou7s1CQDFznUEQ1-190R6Bt7PGE-lVuo58u9yfwmwbTNMfbjFbqfYxY6MPO9uciTyVB0RK6j70ew9zcwRsz1oc1al6Ef_UIdwGzhkDllbz927R-ZJNPI7fn-w91su_7wUCCjuSXtJaH8jpc3LtzJfvfK0bOW70" 
          alt="Logo LaLico" 
          style={{ width: '80px', borderRadius: '50%', marginBottom: '15px' }} 
        />
        <h1 style={{ fontSize: '1.4rem' }}>Finalizar Pedido</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>LaLico Licores & Snacks</p>
      </header>

      {/* 1. IDENTIFICACIÓN */}
      <section className="glass-card">
        <label>Identificación</label>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            value={telefono} 
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Introduce tu número de teléfono"
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '-8px' }}>
             Identifícate para agilizar tu pedido
          </p>
        </div>
      </section>

      {/* 2. ENVÍO */}
      <section className="glass-card">
        <label>Datos de Envío</label>
        <input type="text" placeholder="Nombre completo" />
        <input type="text" placeholder="Cual es tu dirección? (Ej: Carrera 68 #61-88)" />
      </section>

      {/* 3. MÉTODO DE PAGO */}
      <section className="glass-card">
        <label>Método de Pago</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div 
            onClick={() => setMetodoPago('efectivo')}
            className="selectable-pill"
            style={{ 
              border: `1px solid ${metodoPago === 'efectivo' ? 'var(--primary-green)' : 'var(--border-color)'}`,
              background: metodoPago === 'efectivo' ? 'rgba(57, 181, 74, 0.1)' : 'var(--surface-2)',
              padding: '15px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)'
            }}
          >
            💵 Efectivo
          </div>
          <div 
            onClick={() => setMetodoPago('transferencia')}
            className="selectable-pill"
            style={{ 
              border: `1px solid ${metodoPago === 'transferencia' ? 'var(--primary-green)' : 'var(--border-color)'}`,
              background: metodoPago === 'transferencia' ? 'rgba(57, 181, 74, 0.1)' : 'var(--surface-2)',
              padding: '15px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)'
            }}
          >
            🏦 Transferencia
          </div>
        </div>
      </section>

      {/* 4. RESUMEN */}
      <section className="glass-card" style={{ border: 'none', background: 'transparent', paddingLeft: '0', paddingRight: '0' }}>
         {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>{item.nombre} x {item.quantity}</span>
              <span>${new Intl.NumberFormat('es-CO').format(item.precio * item.quantity)}</span>
            </div>
         ))}
         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <span>Envío (Itagüí)</span>
            <span>$6.000</span>
         </div>
         <hr style={{ borderColor: 'var(--border-color)', margin: '15px 0' }} />
         <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--primary-green)', fontSize: '1.3rem' }}>
            <span>Total</span>
            <span>${new Intl.NumberFormat('es-CO').format(finalTotal)}</span>
         </div>
      </section>

      <button 
        onClick={() => navigate(metodoPago === 'transferencia' ? '/pago' : '/')}
        className="btn-primary" 
        style={{ marginTop: '20px' }}
      >
        {metodoPago === 'transferencia' ? 'Continuar al Pago' : 'Confirmar Pedido'}
      </button>
    </div>
  );
};

export default Checkout;
