import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../../shared/CartContext';

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Step State
  const [step, setStep] = useState(1); // 1: Teléfono, 2: Formulario, 3: Éxito
  
  // Form State
  const [telefono, setTelefono] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [direccion, setDireccion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [comprobante, setComprobante] = useState(null);
  const [comprobantePreview, setComprobantePreview] = useState(null);
  const [recordarDireccion, setRecordarDireccion] = useState(true);
  
  // Data State
  const [direccionesDisponibles, setDireccionesDisponibles] = useState([]);
  const [esUsuarioNuevo, setEsUsuarioNuevo] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setComprobante(file);
      setComprobantePreview(URL.createObjectURL(file));
    }
  };

  // Acción: Continuar al paso 2
  const handleNextStep = async () => {
    const telLimpio = telefono.replace(/\D/g, ''); 
    if (telLimpio.length < 10) return;

    setBuscando(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/v1/usuarios/buscar-telefono/?telefono=${telLimpio}`);
      if (res.data.encontrado) {
        setNombres(res.data.nombre || '');
        setApellidos(res.data.apellido || '');
        setDireccionesDisponibles(res.data.direcciones || []);
        if (res.data.direcciones?.length > 0) {
          setDireccion(res.data.direcciones[0]);
        }
        setEsUsuarioNuevo(false);
      } else {
        setEsUsuarioNuevo(true);
        setNombres('');
        setApellidos('');
        setDireccion('');
        setDireccionesDisponibles([]);
      }
      setStep(2);
    } catch (error) {
      console.error("Error buscando usuario:", error);
      setStep(2); 
    } finally {
      setBuscando(false);
    }
  };

  // Acción: Finalizar Pedido
  const handleConfirmOrder = async () => {
    if (!direccion || !nombres || !apellidos) return;
    if (metodoPago === 'transferencia' && !comprobante) {
      alert("Por favor adjunta el comprobante de pago");
      return;
    }
    
    setEnviando(true);
    try {
      const formData = new FormData();
      formData.append('telefono', telefono);
      formData.append('nombres', nombres);
      formData.append('apellidos', apellidos);
      formData.append('direccion', direccion);
      formData.append('notas', observaciones);
      formData.append('metodo_pago', metodoPago);
      formData.append('recordar_direccion', recordarDireccion);
      formData.append('items', JSON.stringify(cart.map(item => ({
        producto: item.id,
        cantidad: item.quantity,
        precio: item.precio
      }))));
      formData.append('costo_envio', 6000);
      
      if (comprobante) {
        formData.append('comprobante', comprobante);
      }

      const res = await axios.post('http://127.0.0.1:8000/api/v1/ventas/pedidos/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.exito) {
        clearCart();
        setStep(3); // Mostrar pantalla de éxito
      }
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      const errorMsg = error.response?.data?.error || "Hubo un error al procesar tu pedido.";
      alert(errorMsg);
    } finally {
      setEnviando(false);
    }
  };

  const envioCost = 6000;
  const finalTotal = total + envioCost;

  return (
    <div className="app-container animate-fade">
      <header style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        {step < 3 && (
            <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => step === 1 ? navigate(-1) : setStep(1)}
                style={{ background: 'var(--surface-high)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
            >
                <span className="material-icons-round">arrow_back</span>
            </motion.button>
        )}
        <h1 className="display-lg" style={{ margin: 0 }}>
             {step < 3 ? 'Finalizar Pedido' : '¡Pedido Confirmado!'}
        </h1>
      </header>

      <AnimatePresence mode="wait">
        {step === 3 ? (
            <motion.div 
                key="step3" 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '1000px', margin: '0 auto', paddingBottom: '100px' }}
            >
                {/* ÉXITO */}
                <div className="glass-card" style={{ padding: '60px 40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(57, 181, 74, 0.05) 0%, rgba(0,0,0,0) 100%)', borderColor: 'rgba(57, 181, 74, 0.2)' }}>
                    <div style={{ width: '80px', height: '80px', background: 'var(--primary-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 30px rgba(57, 181, 74, 0.4)' }}>
                        <span className="material-icons-round" style={{ fontSize: '40px', color: 'black' }}>check</span>
                    </div>
                    <h2 className="display-lg" style={{ marginBottom: '12px' }}>¡Todo listo, {nombres}!</h2>
                    <p className="text-secondary" style={{ maxWidth: '500px', margin: '0 auto 32px' }}>
                        Hemos recibido tu pedido correctamente. En breve nos pondremos en contacto contigo al {telefono} para coordinar la entrega.
                    </p>
                    <button onClick={() => navigate('/')} className="btn-secondary" style={{ display: 'inline-flex', width: 'auto', padding: '16px 40px' }}>
                        Volver al Inicio
                    </button>
                </div>

                {/* INFO DE LA LICO INTEGRADA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h3 className="label-caps" style={{ letterSpacing: '2px', opacity: 0.7 }}>Información de nuestra Sede</h3>
                    <div className="checkout-grid" style={{ gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="glass-card" style={{ padding: '24px' }}>
                                <p className="label-caps" style={{ marginBottom: '16px', fontSize: '0.65rem' }}>Ubicación Física</p>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <span className="material-icons-round" style={{ color: 'var(--primary-green)' }}>place</span>
                                    <div>
                                        <p style={{ fontWeight: 800, margin: 0 }}>Cra 68 #61-88</p>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Calatrava, Itagüí</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="glass-card" style={{ padding: '24px' }}>
                                <p className="label-caps" style={{ marginBottom: '16px', fontSize: '0.65rem' }}>WhatsApp & Soporte</p>
                                <a href="https://wa.me/573005545711" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'flex', gap: '16px', color: 'inherit' }}>
                                    <span className="material-icons-round" style={{ color: '#25D366' }}>message</span>
                                    <p style={{ fontWeight: 800, margin: 0 }}>+57 300 554 57 11</p>
                                </a>
                            </div>

                            <div className="glass-card" style={{ padding: '24px' }}>
                                <p className="label-caps" style={{ marginBottom: '16px', fontSize: '0.65rem' }}>Horarios</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '0.8rem' }}>
                                    <span className="text-secondary">V-S:</span> <span>6PM - 2AM</span>
                                    <span className="text-secondary">D:</span> <span>4PM - 10PM</span>
                                </div>
                            </div>
                        </div>

                        {/* MAPA */}
                        <div className="glass-card" style={{ padding: '8px', height: '100%', minHeight: '340px' }}>
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d-75.613862!3d6.194032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4682055608c0ef%3A0xc319106093be8e45!2sCra.%2068%20%2361-88%2C%20Itag%C3%BCi%2C%20Antioquia!5e0!3m2!1ses-419!2sco!4v1700000000000!5m2!1ses-419!2sco" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0, borderRadius: '16px', minHeight: '320px', filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} 
                                allowFullScreen="" 
                                loading="lazy" 
                            ></iframe>
                        </div>
                    </div>
                </div>
            </motion.div>
        ) : (
            <div className="checkout-grid" key="main-grid">
            {/* Left Column */}
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                >
                  <section className="glass-card" style={{ padding: '32px' }}>
                    <p className="label-caps" style={{ marginBottom: '24px' }}>Paso 1: Identificación</p>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>NÚMERO DE TELÉFONO</label>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', opacity: 0.6 }}>Usamos tu número para reconocer tus pedidos anteriores y darte un servicio más rápido.</p>
                      <input 
                        type="tel" 
                        className="premium-input"
                        autoFocus
                        autoComplete="off"
                        style={{ fontSize: '1.4rem', fontWeight: 800, padding: '24px', textAlign: 'center', letterSpacing: '2px' }}
                        value={telefono} 
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="300 000 0000"
                        onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                      />
                    </div>
                    <button 
                      className="btn-primary" 
                      disabled={telefono.replace(/\D/g, '').length < 10 || buscando}
                      onClick={handleNextStep}
                      style={{ width: '100%', height: '64px', fontSize: '1.1rem' }}
                    >
                      {buscando ? 'Buscando cliente...' : 'Siguiente'}
                    </button>
                  </section>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                >
                  <section className="glass-card" style={{ padding: '28px' }}>
                    <p className="label-caps" style={{ marginBottom: '24px' }}>Paso 2: Datos de Entrega</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <label className="label-caps" style={{ fontSize: '0.65rem' }}>Nombres</label>
                        <input 
                          type="text" 
                          className="premium-input" 
                          value={nombres} 
                          onChange={(e) => setNombres(e.target.value)}
                          placeholder="Ej: Juan"
                        />
                      </div>
                      <div>
                        <label className="label-caps" style={{ fontSize: '0.65rem' }}>Apellidos</label>
                        <input 
                          type="text" 
                          className="premium-input" 
                          value={apellidos} 
                          onChange={(e) => setApellidos(e.target.value)}
                          placeholder="Ej: Pérez"
                        />
                      </div>
                    </div>
    
                    <div style={{ marginBottom: '20px' }}>
                      <label className="label-caps" style={{ fontSize: '0.65rem' }}>Dirección de Entrega</label>
                      {direccionesDisponibles.length > 0 && (
                        <div className="hide-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '12px' }}>
                          {direccionesDisponibles.map((dep, i) => (
                            <button 
                              key={i}
                              onClick={() => setDireccion(dep)}
                              style={{
                                padding: '8px 16px', borderRadius: '24px', fontSize: '0.75rem', fontWeight: 600,
                                background: direccion === dep ? 'var(--primary-green)' : 'var(--surface-high)',
                                color: direccion === dep ? 'black' : 'var(--text-secondary)',
                                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: '0.2s'
                              }}
                            >
                              {dep.split(',')[0]}
                            </button>
                          ))}
                        </div>
                      )}
                      <input 
                        type="text" 
                        className="premium-input" 
                        value={direccion} 
                        onChange={(e) => setDireccion(e.target.value)}
                        placeholder="Calle, Carrera, Barrio..."
                      />
                      
                      {esUsuarioNuevo && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={recordarDireccion} 
                            onChange={(e) => setRecordarDireccion(e.target.checked)}
                            style={{ width: '18px', height: '18px', accentColor: 'var(--primary-green)' }}
                          />
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Recordar esta dirección para mi próxima compra</span>
                        </label>
                      )}
                    </div>
    
                    <div>
                      <label className="label-caps" style={{ fontSize: '0.65rem' }}>Observaciones (Opcional)</label>
                      <textarea 
                        className="premium-input" 
                        style={{ height: '80px', paddingTop: '12px', resize: 'none' }}
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        placeholder="Instrucciones adicionales, código de apto, etc."
                      />
                    </div>
                  </section>
    
                  <section className="glass-card" style={{ padding: '28px' }}>
                    <p className="label-caps" style={{ marginBottom: '20px' }}>Método de Pago</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                       <motion.div 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setMetodoPago('efectivo'); setComprobante(null); setComprobantePreview(null); }}
                        style={{ 
                          border: `1px solid ${metodoPago === 'efectivo' ? 'var(--primary-green)' : 'rgba(255,255,255,0.05)'}`,
                          background: metodoPago === 'efectivo' ? 'rgba(57, 181, 74, 0.08)' : 'var(--surface-low)',
                          padding: '24px 16px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)'
                        }}
                      >
                        <span className="material-icons-round" style={{ fontSize: '28px', color: metodoPago === 'efectivo' ? 'var(--primary-green)' : 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>payments</span>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Efectivo</span>
                      </motion.div>
                      
                      <motion.div 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMetodoPago('transferencia')}
                        style={{ 
                          border: `1px solid ${metodoPago === 'transferencia' ? 'var(--primary-green)' : 'rgba(255,255,255,0.05)'}`,
                          background: metodoPago === 'transferencia' ? 'rgba(57, 181, 74, 0.08)' : 'var(--surface-low)',
                          padding: '24px 16px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)'
                        }}
                      >
                        <span className="material-icons-round" style={{ fontSize: '28px', color: metodoPago === 'transferencia' ? 'var(--primary-green)' : 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>account_balance</span>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Transferencia</span>
                      </motion.div>
                    </div>

                    {metodoPago === 'transferencia' && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            style={{ paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            <div style={{ background: 'var(--surface-high)', padding: '32px 24px', borderRadius: '24px', display: 'flex', gap: '20px', alignItems: 'center', border: '1px solid rgba(253, 189, 45, 0.15)' }}>
                                <div style={{ width: '80px', height: '80px', background: '#fdbd2d', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <span style={{ color: 'black', fontWeight: 900, fontSize: '2rem' }}>B</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p className="label-caps" style={{ fontSize: '0.7rem', color: '#fdbd2d', marginBottom: '6px', letterSpacing: '2px' }}>Bancolombia</p>
                                    <p style={{ fontWeight: 900, fontSize: '1.4rem', margin: '4px 0', fontFamily: 'var(--font-display)', color: 'white' }}>Ahorros: 300 554 571 11</p>
                                    <p style={{ fontSize: '0.85rem', opacity: 0.6, fontWeight: 500 }}>Titular: La Lico Premium Store</p>
                                </div>
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowQR(true)}
                                    style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                                >
                                    <div style={{ background: 'white', padding: '8px', borderRadius: '8px', marginBottom: '8px', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        <img src="/qr_lalico.png" alt="QR" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)' }}>Ampliar QR</p>
                                </motion.div>
                            </div>

                            <div style={{ background: 'rgba(57, 181, 74, 0.05)', padding: '20px', borderRadius: '16px', border: '1px dashed rgba(57, 181, 74, 0.2)' }}>
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                    <span className="material-icons-round" style={{ color: 'var(--primary-green)' }}>info</span>
                                    <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>Para pasar tu pedido a <b>despacho</b>, adjunta tu comprobante.</p>
                                </div>

                                {comprobantePreview ? (
                                    <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                                        <img src={comprobantePreview} alt="Comprobante" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button 
                                            onClick={() => { setComprobante(null); setComprobantePreview(null); }}
                                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        >
                                            <span className="material-icons-round" style={{ fontSize: '18px' }}>close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ position: 'relative' }}>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }}
                                        />
                                        <div style={{ background: 'var(--surface-low)', height: '100px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <span className="material-icons-round" style={{ fontSize: '32px', color: 'var(--primary-green)' }}>cloud_upload</span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Subir comprobante</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
     
            {/* Right Column: Order Summary */}
            <div>
              <section className="glass-card" style={{ padding: '28px', position: 'sticky', top: '80px' }}>
                 <p className="label-caps" style={{ marginBottom: '24px' }}>Resumen de Compra</p>
                 <div className="hide-scrollbar" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {cart.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                        <span className="text-secondary">{item.nombre} <small style={{ opacity: 0.6 }}>x{item.quantity}</small></span>
                        <span style={{ fontWeight: 600 }}>${new Intl.NumberFormat('es-CO').format(item.precio * item.quantity)}</span>
                        </div>
                    ))}
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '16px' }}>
                    <span>Domicilio (Itagüí)</span>
                    <span>$6.000</span>
                 </div>
                 <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '20px 0' }}></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="headline-md" style={{ margin: 0, fontSize: '1.1rem' }}>Total</span>
                    <span style={{ color: 'var(--primary-green)', fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                        ${new Intl.NumberFormat('es-CO').format(finalTotal)}
                    </span>
                 </div>
     
                <button 
                  onClick={() => step === 1 ? handleNextStep() : handleConfirmOrder()}
                  className="btn-primary" 
                  style={{ marginTop: '28px', height: '60px', fontSize: '1.1rem', width: '100%' }}
                  disabled={(step === 1 && (telefono.replace(/\D/g, '').length < 10 || buscando)) || (step === 2 && (!direccion || !nombres || !apellidos || enviando || (metodoPago === 'transferencia' && !comprobante)))}
                >
                  {step === 1 ? (buscando ? 'Buscando...' : 'Siguiente') : (enviando ? 'Procesando...' : (metodoPago === 'transferencia' ? 'Enviar Comprobante & Pedido' : 'Confirmar Pedido'))}
                </button>
                
                <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.72rem', opacity: 0.5 }}>
                  Entrega prioritaria en Itagüí y alrededores.
                </p>
              </section>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal QR Ampliado */}
      <AnimatePresence>
        {showQR && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowQR(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="glass-card"
                    style={{ padding: '32px', textAlign: 'center', maxWidth: '400px', width: '100%', background: 'white' }}
                >
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <span className="label-caps" style={{ color: 'black', letterSpacing: '2px' }}>Escanear QR</span>
                        <button onClick={() => setShowQR(false)} style={{ background: 'none', border: 'none', color: 'black', cursor: 'pointer' }}>
                            <span className="material-icons-round">close</span>
                        </button>
                    </header>
                    <div style={{ background: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                        <img 
                            src="/qr_lalico.png" 
                            alt="Bancolombia QR" 
                            style={{ width: '100%', borderRadius: '8px' }} 
                        />
                    </div>
                    <p style={{ marginTop: '24px', color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>
                        Escanea este código desde tu App de Bancolombia para realizar la transferencia.
                    </p>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
