import React from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.4rem' }}>Información de Contacto</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Estamos para servirte en tu celebración</p>
      </header>

      {/* 🚀 BOTONES DE CONTACTO RÁPIDO */}
      <section style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
         <a 
           href="https://wa.me/573211234567" 
           target="_blank" 
           rel="noreferrer"
           className="btn-primary" 
           style={{ background: '#25D366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
         >
           💬 Escríbenos por WhatsApp
         </a>
         <a 
           href="https://instagram.com/lalico" 
           target="_blank" 
           rel="noreferrer"
           className="btn-primary" 
           style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', color: 'white' }}
         >
           📸 Síguenos en Instagram
         </a>
      </section>

      {/* 📍 UBICACIÓN FÍSICA */}
      <section className="glass-card">
         <label>Dirección Física</label>
         <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Itagüí, Calatrava</h3>
         <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Carrera 68 #61-88</p>
         <div style={{ marginTop: '15px' }}>
            <span style={{ fontSize: '1.2rem' }}>📍</span> <span style={{ fontSize: '0.8rem', opacity: '0.7' }}>Abrir en Google Maps</span>
         </div>
      </section>

      {/* ⏰ HORARIO DE ATENCIÓN */}
      <section className="glass-card">
         <label>Horario de Atención</label>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '0.9rem' }}>
            <span>Viernes:</span> <strong>6:00 PM - 1:00 AM</strong>
            <span>Sábado:</span> <strong>6:00 PM - 2:00 AM</strong>
            <span>Domingo:</span> <strong>4:00 PM - 10:00 PM</strong>
         </div>
         <p style={{ marginTop: '15px', color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '0.8rem' }}>
            <span className="status-dot status-success"></span> ABIERTO AHORA
         </p>
      </section>

      <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '20px' }}>Volver al Inicio</button>
    </div>
  );
};

export default Contact;
