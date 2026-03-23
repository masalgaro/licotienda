import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container animate-fade">
      <header style={{ marginBottom: '40px' }}>
        <h1 className="display-lg">Contacto</h1>
        <p className="text-secondary" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}>Estamos para servirte en tu celebración</p>
      </header>

      {/* Botones de Contacto Rápido */}
      <section className="contact-grid" style={{ marginBottom: '40px' }}>
         <motion.a 
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.96 }}
           href="https://wa.me/573005545711" 
           target="_blank" 
           rel="noreferrer"
           className="glass-card" 
           style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', cursor: 'pointer', borderColor: 'rgba(37, 211, 102, 0.2)' }}
         >
           <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(37, 211, 102, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
             <span className="material-icons-round" style={{ color: '#25D366', fontSize: '26px' }}>message</span>
           </div>
           <div>
             <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>WhatsApp</p>
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Escríbenos directo</p>
           </div>
         </motion.a>

         <motion.a 
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.96 }}
           href="https://instagram.com/lalico.virtual" 
           target="_blank" 
           rel="noreferrer"
           className="glass-card" 
           style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', cursor: 'pointer', borderColor: 'rgba(220, 39, 67, 0.15)' }}
         >
           <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(220, 39, 67, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
             <span className="material-icons-round" style={{ color: '#dc2743', fontSize: '26px' }}>camera_alt</span>
           </div>
           <div>
             <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>Instagram</p>
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Síguenos @lalico.virtual</p>
           </div>
         </motion.a>

         <motion.a 
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.96 }}
           href="tel:+573005545711"
           className="glass-card" 
           style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', cursor: 'pointer' }}
         >
           <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(57, 181, 74, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
             <span className="material-icons-round" style={{ color: 'var(--primary-green)', fontSize: '26px' }}>call</span>
           </div>
           <div>
             <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>Llamar</p>
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>300 554 57 11</p>
           </div>
         </motion.a>
      </section>

      {/* Ubicación & Horario - Side by side on desktop */}
      <div className="checkout-grid">
        <div className="glass-card" style={{ padding: '28px' }}>
           <p className="label-caps" style={{ marginBottom: '20px' }}>Dirección Física</p>
           <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--surface-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-icons-round" style={{ color: 'var(--primary-green)' }}>place</span>
              </div>
              <div>
                  <h3 className="headline-md" style={{ marginBottom: '4px' }}>Itagüí, Calatrava</h3>
                  <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Carrera 68 #61-88</p>
              </div>
           </div>
        </div>

        <div className="glass-card" style={{ padding: '28px' }}>
           <p className="label-caps" style={{ marginBottom: '20px' }}>Horario de Atención</p>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Viernes:</span> <strong>6:00 PM - 1:00 AM</strong>
              <span style={{ color: 'var(--text-secondary)' }}>Sábado:</span> <strong>6:00 PM - 2:00 AM</strong>
              <span style={{ color: 'var(--text-secondary)' }}>Domingo:</span> <strong>4:00 PM - 10:00 PM</strong>
           </div>
           
           <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-green)', boxShadow: '0 0 10px var(--primary-green)' }}></div>
              <p style={{ color: 'var(--primary-green)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                 ABIERTO AHORA
              </p>
           </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bottom-nav">
          <Link to="/" className="nav-item">
              <span className="material-icons-round">home</span>
              <span>Inicio</span>
          </Link>
          <Link to="/carrito" className="nav-item">
              <span className="material-icons-round">shopping_cart</span>
              <span>Carrito</span>
          </Link>
          <Link to="/contacto" className="nav-item active">
              <span className="material-icons-round">info</span>
              <span>Info</span>
          </Link>
          <Link to="/admin/inventario" className="nav-item">
              <span className="material-icons-round">inventory_2</span>
              <span>Admin</span>
          </Link>
      </nav>
    </div>
  );
};

export default Contact;
