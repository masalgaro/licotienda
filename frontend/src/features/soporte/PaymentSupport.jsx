import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSupport = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  return (
    <div className="app-container animate-fade" style={{ paddingBottom: '40px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 className="display-lg">Pago Digital</h1>
        <p className="text-secondary">Transfiere y sube tu comprobante para validar tu pedido inmediatamente.</p>
      </header>

      {/* 💳 TARJETA BANCARIA PREMIUM */}
      <section 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(145deg, #0f1c3f 0%, #000000 100%)', 
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '32px', color: 'white', position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(57, 181, 74, 0.05)'
        }}
      >
        {/* Chips Decorativos */}
        <div style={{ width: '45px', height: '35px', background: 'linear-gradient(90deg, #ffd700, #b8860b)', borderRadius: '6px', marginBottom: '32px', opacity: 0.8 }}></div>
        
        <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '1px', marginBottom: '8px' }}>CUENTA DE AHORROS</p>
            <h2 style={{ fontSize: '1.6rem', letterSpacing: '3px', fontFamily: 'monospace', fontWeight: 500 }}>912-123456-78</h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '1px', marginBottom: '4px' }}>BENEFICIARIO</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>LaLico S.A.S.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-green)' }}>Bancolombia</p>
            </div>
        </div>
        
        {/* Glow effect */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary-green)', opacity: 0.05, filter: 'blur(50px)' }}></div>
      </section>

      {/* 🤳 CÓDIGO QR SECCIÓN */}
      <section style={{ textAlign: 'center', margin: '40px 0' }}>
         <div className="glass-card" style={{ display: 'inline-block', padding: '20px', background: 'white' }}>
            <div style={{ width: '200px', height: '200px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #eee' }}>
               <span className="material-icons-round" style={{ color: '#ccc', fontSize: '64px' }}>qr_code_2</span>
            </div>
         </div>
         <p className="text-secondary" style={{ fontSize: '0.85rem', marginTop: '16px', maxWidth: '250px', margin: '16px auto' }}>
            Escanea el código QR desde tu App Bancaria (Nequi, Bancolombia, Daviplata).
         </p>
      </section>

      {/* 📁 ZONA DE CARGA PREMIUM */}
      <section className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
         <div 
           onClick={() => document.getElementById('file-upload').click()}
           style={{ 
             padding: '40px 24px', textAlign: 'center', cursor: 'pointer',
             background: file ? 'rgba(57, 181, 74, 0.03)' : 'transparent',
             transition: 'var(--transition)'
           }}
         >
            <span className="material-icons-round" style={{ fontSize: '40px', color: file ? 'var(--primary-green)' : 'var(--surface-highest)', marginBottom: '16px' }}>
                {file ? 'check_circle' : 'cloud_upload'}
            </span>
            <p style={{ fontWeight: 600, color: file ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
               {file ? `Archivo seleccionado: ${file.name}` : 'Adjunta el comprobante (Capture de pantalla)'}
            </p>
            {!file && <p className="label-caps" style={{ marginTop: '8px', fontSize: '0.6rem' }}>Formatos: JPG, PNG, PDF</p>}
            
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
           alert('¡Comprobante enviado con éxito! Tu pedido será validado pronto en Itagüí.');
           navigate('/');
        }}
        className="btn-primary" 
        style={{ marginTop: '32px', height: '60px', opacity: !file ? 0.4 : 1 }}
      >
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span className="material-icons-round">send</span>
            Enviar Comprobante
        </span>
      </button>

      <button onClick={() => navigate(-1)} style={{ width: '100%', padding: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '12px', fontSize: '0.9rem' }}>
          Volver atrás
      </button>
    </div>
  );
};

export default PaymentSupport;
