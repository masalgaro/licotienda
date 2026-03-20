import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../shared/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cart, updateQuantity, total, itemCount } = useCart();
    const navigate = useNavigate();

    return (
        <div className="app-container" style={{ padding: 0 }}>
            {/* Header */}
            <div style={{ padding: '30px 20px 10px', display: 'flex', alignItems: 'center', gap: '20px', position: 'sticky', top: 0, background: 'var(--bg-black)', zIndex: 10 }}>
                <button 
                    onClick={() => navigate(-1)}
                    style={{ background: 'var(--surface-2)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                >
                    <span className="material-icons-round">arrow_back_ios_new</span>
                </button>
                <h1 style={{ margin: 0, fontSize: '1.4rem' }}>Tu Carrito</h1>
            </div>

            <div style={{ padding: '20px' }}>
                {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <span className="material-icons-round" style={{ fontSize: '64px', color: 'var(--surface-2)', marginBottom: '20px' }}>shopping_cart</span>
                        <h3>Tu carrito está vacío</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>¡Agrega algo delicioso para empezar!</p>
                        <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Ir a la tienda</Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {cart.map(item => (
                            <div key={item.id} className="glass-card" style={{ padding: '12px', margin: 0, display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div style={{ width: '80px', height: '80px', background: 'var(--bg-black)', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
                                    <img src={item.imagen_url} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '5px' }} />
                                </div>
                                <div style={{ flexGrow: 1 }}>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '4px', lineHeight: '1.2' }}>{item.nombre}</h4>
                                    <p style={{ color: 'var(--primary-green)', fontWeight: 700, fontSize: '0.9rem' }}>
                                        ${new Intl.NumberFormat('es-CO').format(item.precio)}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', background: 'var(--surface-2)', padding: '5px', borderRadius: '20px' }}>
                                    <button 
                                        onClick={() => updateQuantity(item.id, 1)}
                                        style={{ background: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                    >
                                        <span className="material-icons-round" style={{ fontSize: '16px', color: 'black' }}>add</span>
                                    </button>
                                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, -1)}
                                        style={{ background: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                    >
                                        <span className="material-icons-round" style={{ fontSize: '16px', color: 'black' }}>remove</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Summary */}
                        <div className="glass-card" style={{ marginTop: '10px', padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--text-secondary)' }}>
                                <span>Subtotal</span>
                                <span>${new Intl.NumberFormat('es-CO').format(total)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: 'var(--text-secondary)' }}>
                                <span>Envío</span>
                                <span style={{ color: 'var(--primary-green)', fontWeight: 600 }}>$6.000 (Itagüí)</span>
                            </div>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginBottom: '15px' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700 }}>Total</span>
                                <span style={{ color: 'var(--primary-green)', fontSize: '1.5rem', fontWeight: 900 }}>
                                    ${new Intl.NumberFormat('es-CO').format(total + 6000)}
                                </span>
                            </div>
                        </div>

                        <Link to="/checkout" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center', marginTop: '10px' }}>
                            Proceder al Pago
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
