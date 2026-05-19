import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../config':

const ESTADO_INFO = {
    PENDIENTE_PAGO:  { label: 'Pendiente de Pago', icon: 'schedule',       color: 'var(--text-secondary)' },
    PAGO_SUBIDO:     { label: 'Pago Subido',        icon: 'upload',         color: '#fdbd2d' },
    PAGO_VERIFICADO: { label: 'Pago Verificado',    icon: 'verified',       color: 'var(--primary-green)' },
    PAGO_RECHAZADO:  { label: 'Pago Rechazado',     icon: 'cancel',         color: '#ff4d4d' },
    PREPARANDO:      { label: 'Preparando',          icon: 'restaurant',     color: '#fdbd2d' },
    DESPACHADO:      { label: 'Despachado',          icon: 'local_shipping', color: '#4ea8de' },
    ENTREGADO:       { label: 'Entregado',           icon: 'check_circle',   color: 'var(--primary-green)' },
};

const PASOS_ESTADO = [
    'PENDIENTE_PAGO', 'PAGO_SUBIDO', 'PAGO_VERIFICADO',
    'PREPARANDO', 'DESPACHADO', 'ENTREGADO',
];

const RastreoPedidos = () => {
    const [telefono, setTelefono] = useState('');
    const [pedidos, setPedidos] = useState(null);
    const [buscando, setBuscando] = useState(false);

    const handleBuscar = async () => {
        const tel = telefono.replace(/\D/g, '');
        if (tel.length < 10) return;
        setBuscando(true);
        try {
            const res = await axios.get(
                `${API_BASE_URL}/api/v1/ventas/seguimiento/?telefono=${tel}`
            );
            setPedidos(res.data);
        } catch {
            setPedidos([]);
        } finally {
            setBuscando(false);
        }
    };

    return (
        <div className="app-container animate-fade">
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                <Link
                    to="/"
                    style={{
                        background: 'var(--surface-high)', border: '1px solid var(--glass-border)',
                        borderRadius: '50%', width: '44px', height: '44px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none',
                    }}
                >
                    <span className="material-icons-round">arrow_back</span>
                </Link>
                <div>
                    <p className="label-caps" style={{ color: 'var(--primary-green)', margin: '0 0 4px' }}>
                        Seguimiento
                    </p>
                    <h1 className="display-lg" style={{ margin: 0 }}>Rastrear Pedido</h1>
                </div>
            </header>

            <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Buscador */}
                <section className="glass-card" style={{ padding: '28px' }}>
                    <p className="label-caps" style={{ marginBottom: '8px' }}>Ingresa tu número</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', opacity: 0.7 }}>
                        Consulta el estado de todos tus pedidos usando el número que registraste al pedir.
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                            type="tel"
                            className="premium-input"
                            style={{ flex: 1, fontSize: '1.2rem', fontWeight: 700, textAlign: 'center', letterSpacing: '2px' }}
                            placeholder="300 000 0000"
                            value={telefono}
                            onChange={e => setTelefono(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                        />
                        <button
                            className="btn-primary"
                            style={{ width: 'auto', padding: '0 24px', flexShrink: 0 }}
                            disabled={telefono.replace(/\D/g, '').length < 10 || buscando}
                            onClick={handleBuscar}
                        >
                            {buscando
                                ? <span className="material-icons-round" style={{ animation: 'spin 1s linear infinite' }}>sync</span>
                                : <span className="material-icons-round">search</span>
                            }
                        </button>
                    </div>
                </section>

                {/* Resultados */}
                {pedidos !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                    >
                        {pedidos.length === 0 ? (
                            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                                <span className="material-icons-round" style={{ fontSize: '40px', opacity: 0.3, display: 'block', marginBottom: '12px' }}>
                                    search_off
                                </span>
                                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                                    No encontramos pedidos para ese número.
                                </p>
                            </div>
                        ) : pedidos.map(p => {
                            const info = ESTADO_INFO[p.estado] || { label: p.estado, icon: 'help', color: 'var(--text-secondary)' };
                            const pasoActual = PASOS_ESTADO.indexOf(p.estado);

                            return (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="glass-card"
                                    style={{ padding: '24px' }}
                                >
                                    {/* Cabecera del pedido */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                        <div>
                                            <p style={{ fontWeight: 900, fontSize: '1.1rem', margin: '0 0 4px' }}>
                                                Pedido #{p.id}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                                                {new Date(p.creado_en).toLocaleDateString('es-CO', {
                                                    day: '2-digit', month: 'short',
                                                    hour: '2-digit', minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            background: `${info.color}18`, color: info.color,
                                            padding: '6px 12px', borderRadius: '8px',
                                            fontSize: '0.75rem', fontWeight: 800,
                                        }}>
                                            <span className="material-icons-round" style={{ fontSize: '16px' }}>{info.icon}</span>
                                            {info.label}
                                        </div>
                                    </div>

                                    {/* Barra de progreso */}
                                    {p.estado !== 'PAGO_RECHAZADO' && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '20px' }}>
                                            {PASOS_ESTADO.filter(e => e !== 'PAGO_SUBIDO').map((estado, i, arr) => {
                                                const idx = PASOS_ESTADO.indexOf(estado);
                                                const done = pasoActual >= idx;
                                                const last = i === arr.length - 1;
                                                return (
                                                    <React.Fragment key={estado}>
                                                        <div style={{
                                                            width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                                                            background: done ? info.color : 'var(--surface-high)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            transition: '0.3s',
                                                        }}>
                                                            <span className="material-icons-round" style={{ fontSize: '14px', color: done ? 'black' : 'var(--text-secondary)' }}>
                                                                {ESTADO_INFO[estado]?.icon || 'circle'}
                                                            </span>
                                                        </div>
                                                        {!last && (
                                                            <div style={{
                                                                flex: 1, height: '2px',
                                                                background: pasoActual > idx ? info.color : 'var(--surface-high)',
                                                                transition: '0.3s',
                                                            }} />
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Info adicional */}
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {p.domicilio && p.direccion && (
                                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                <span className="material-icons-round" style={{ fontSize: '16px' }}>place</span>
                                                {p.direccion}
                                            </div>
                                        )}
                                        {!p.domicilio && (
                                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                <span className="material-icons-round" style={{ fontSize: '16px' }}>storefront</span>
                                                Retiro en tienda
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>

            <nav className="bottom-nav">
                <Link to="/" className="nav-item">
                    <span className="material-icons-round">home</span>
                    <span>Inicio</span>
                </Link>
                <Link to="/carrito" className="nav-item">
                    <span className="material-icons-round">shopping_cart</span>
                    <span>Carrito</span>
                </Link>
                <Link to="/rastreo" className="nav-item active">
                    <span className="material-icons-round">location_searching</span>
                    <span>Rastreo</span>
                </Link>
                <Link to="/contacto" className="nav-item">
                    <span className="material-icons-round">info</span>
                    <span>Info</span>
                </Link>
            </nav>
        </div>
    );
};

export default RastreoPedidos;
