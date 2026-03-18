import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [telefono, setTelefono] = useState('+57 ');
  const [metodoPago, setMetodoPago] = useState('efectivo');

  return (
    <div className="app-container">
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <img 
          src="/logo_lalico.jpeg" 
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
              padding: '15px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer'
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
              padding: '15px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer'
            }}
          >
            🏦 Transferencia
          </div>
        </div>
      </section>

      {/* 4. RESUMEN */}
      <section className="glass-card" style={{ border: 'none', background: 'transparent', paddingLeft: '0', paddingRight: '0' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Aguardiente Antioqueño Azul</span>
            <span>$50.000</span>
         </div>
         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Snacks Mix Familiar</span>
            <span>$15.000</span>
         </div>
         <hr style={{ borderColor: 'var(--border-color)', margin: '15px 0' }} />
         <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--primary-green)', fontSize: '1.2rem' }}>
            <span>Total</span>
            <span>$65.000</span>
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
