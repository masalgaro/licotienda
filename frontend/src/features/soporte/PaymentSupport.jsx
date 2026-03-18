import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSupport = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  return (
    <div className="app-container">
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <img 
          src="/logo_lalico.jpeg" 
          alt="Logo LaLico" 
          style={{ width: '60px', borderRadius: '50%', marginBottom: '10px' }} 
        />
        <h1 style={{ fontSize: '1.4rem' }}>Soporte de Pago</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Transfiere y sube tu comprobante</p>
      </header>

      {/* 💳 TARJETA BANCARIA (ESTILO BANCOLOMBIA) */}
      <section 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, #0A1C3E 0%, #1c336b 100%)', 
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '25px', color: 'white', position: 'relative'
        }}
      >
        <p style={{ fontSize: '0.7rem', opacity: '0.7', marginBottom: '4px' }}>NOMBRE DEL BENEFICIARIO</p>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>LaLico S.A.S.</h3>
        <p style={{ fontSize: '0.7rem', opacity: '0.7', marginBottom: '4px' }}>NÚMERO DE CUENTA (AHORROS)</p>
        <h2 style={{ fontSize: '1.4rem', letterSpacing: '2px' }}>#912-123456-78</h2>
        <div style={{ position: 'absolute', top: '25px', right: '25px', opacity: '0.5', fontSize: '1.5rem' }}>🏦</div>
      </section>

      {/* 🤳 CÓDIGO QR */}
      <section style={{ textAlign: 'center', margin: '30px 0' }}>
         <div style={{ 
            background: 'white', display: 'inline-block', padding: '15px', borderRadius: '16px',
            boxShadow: '0 0 20px rgba(57, 181, 74, 0.2)'
         }}>
            <div style={{ width: '180px', height: '180px', background: '#e1e1e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span style={{ color: 'black', fontSize: '0.8rem' }}>QR DE PAGO LA LICO</span>
            </div>
         </div>
         <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '15px' }}>
            Escanea desde tu app bancaria (Nequi, Bancolombia, etc.)
         </p>
      </section>

      {/* 📁 ZONA DE CARGA */}
      <section className="glass-card">
         <div 
           className="upload-zone"
           onClick={() => document.getElementById('file-upload').click()}
         >
            <span style={{ fontSize: '2rem' }}>📄</span>
            <p style={{ marginTop: '10px' }}>
               {file ? `Archivo: ${file.name}` : 'Haz clic para subir tu comprobante'}
            </p>
            <input 
               id="file-upload" 
               type="file" 
               style={{ display: 'none' }} 
               onChange={(e) => setFile(e.target.files[0])}
            />
         </div>
      </section>

      <button 
        disabled={!file}
        onClick={() => {
           alert('¡Comprobante enviado con éxito! Tu pedido será validado pronto.');
           navigate('/');
        }}
        className="btn-primary" 
        style={{ marginTop: '20px' }}
      >
        Finalizar y Enviar
      </button>
    </div>
  );
};

export default PaymentSupport;
