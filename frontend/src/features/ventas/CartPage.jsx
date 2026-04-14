import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../shared/cartHooks';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const CartPage = () => {
    const { cart, updateQuantity, addToCart, total, itemCount } = useCart();
    const navigate = useNavigate();
    const [sugerencias, setSugerencias] = React.useState([]);
    const [validando, setValidando] = React.useState(false);

    React.useEffect(() => {
        const fetchSugerencias = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/v1/catalogo/productos/');
                const disponibles = res.data.filter(p => !cart.find(c => c.id === p.id));
                setSugerencias(disponibles.slice(0, 4));
            } catch (err) {
                console.error("Error cargando sugerencias:", err);
            }
        };
        fetchSugerencias();
    }, [cart]);

    const handleProceedToCheckout = async (e) => {
        e.preventDefault();
        setValidando(true);
        try {
            const formData = {
                items: cart.map(item => ({
                    producto: item.id,
                    cantidad: item.quantity
                }))
            };
            const res = await axios.post(`${API_BASE_URL}/api/v1/ventas/validar-carrito/`, formData);
            if (res.data.exito) {
                navigate('/checkout');
            }
        } catch(err) {
            alert(err.response?.data?.error || "Error validando el carrito. Algunas unidades ya no están disponibles.");
        } finally {
            setValidando(false);
        }
    };

    return (
        <div className="app-container animate-fade">
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(-1)}
                    style={{ background: 'var(--surface-high)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                >
                    <span className="material-icons-round">arrow_back</span>
                </motion.button>
                <h1 className="display-lg" style={{ margin: 0 }}>Tu Carrito</h1>
                {itemCount > 0 && (
                    <span className="label-caps" style={{ marginLeft: 'auto', color: 'var(--text-highlight)' }}>{itemCount} items</span>
                )}
            </header>

            {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                    <div style={{ width: '120px', height: '120px', background: 'var(--surface-low)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <span className="material-icons-round" style={{ fontSize: '48px', color: 'var(--surface-highest)' }}>shopping_cart</span>
                    </div>
                    <h2 className="headline-md">Tu carrito está vacío</h2>
                    <p className="text-secondary" style={{ marginBottom: '32px' }}>¡Agrega algo delicioso para empezar la celebración!</p>
                    <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', width: 'auto', padding: '16px 40px' }}>Ir a la tienda</Link>
                </div>
            ) : (
                <div className="checkout-grid">
                    {/* Cart Items Column */}
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                            {cart.map((item, idx) => (
                                <motion.div 
                                    key={item.id} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="glass-card" 
                                    style={{ padding: '16px', margin: 0, display: 'flex', gap: '16px', alignItems: 'center' }}
                                >
                                    <div style={{ width: '72px', height: '72px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <img src={item.imagen ? (item.imagen.startsWith('http') ? item.imagen : `${API_BASE_URL}${item.imagen}`) : (item.imagen_url || '/placeholder.png')} alt={item.nombre} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                                    </div>
                                    
                                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.nombre}</h4>
                                        <p style={{ color: 'var(--primary-green)', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-display)' }}>
                                            ${new Intl.NumberFormat('es-CO').format(item.precio)}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface-highest)', padding: '6px 12px', borderRadius: '12px', flexShrink: 0 }}>
                                        <motion.button 
                                            whileTap={{ scale: 0.8 }}
                                            onClick={() => updateQuantity(item.id, -1)}
                                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
                                        >
                                            <span className="material-icons-round" style={{ fontSize: '20px' }}>remove</span>
                                        </motion.button>
                                        <span style={{ fontWeight: 800, fontSize: '1rem', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                        <motion.button 
                                            whileTap={{ scale: 0.8 }}
                                            onClick={() => updateQuantity(item.id, 1)}
                                            style={{ background: 'none', border: 'none', color: 'var(--primary-green)', cursor: 'pointer', display: 'flex' }}
                                        >
                                            <span className="material-icons-round" style={{ fontSize: '20px' }}>add</span>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* SECCIÓN: ¿ALGO MÁS PARA LLEVAR? */}
                        {sugerencias.length > 0 && (
                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <span className="material-icons-round" style={{ color: 'var(--text-highlight)', fontSize: '20px' }}>auto_awesome</span>
                                    <h3 className="label-caps" style={{ margin: 0, fontSize: '0.85rem' }}>¿Algo más para llevar? (Último Antojo)</h3>
                                </div>
                                <div className="hide-scrollbar" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
                                    {sugerencias.map(prod => (
                                        <motion.div 
                                            key={prod.id} 
                                            whileHover={{ y: -4 }}
                                            style={{ 
                                                minWidth: '160px', background: 'var(--surface-low)', borderRadius: '20px', padding: '16px', border: '1px solid var(--glass-border)',
                                                display: 'flex', flexDirection: 'column', gap: '8px'
                                            }}
                                        >
                                            <div style={{ height: '80px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img src={prod.imagen ? (prod.imagen.startsWith('http') ? prod.imagen : `${API_BASE_URL}${prod.imagen}`) : (prod.imagen_url || '/placeholder.png')} alt={prod.nombre} style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
                                            </div>
                                            <h4 style={{ fontSize: '0.75rem', fontWeight: 600, height: '2.4em', overflow: 'hidden', margin: 0 }}>{prod.nombre}</h4>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                                <span style={{ color: 'var(--primary-green)', fontWeight: 800, fontSize: '0.85rem' }}>${new Intl.NumberFormat('es-CO').format(prod.precio)}</span>
                                                <button 
                                                    onClick={() => addToCart(prod)}
                                                    style={{ background: 'var(--surface-highest)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <span className="material-icons-round" style={{ fontSize: '18px' }}>add</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary Column */}
                    <div>
                        <div className="glass-card" style={{ padding: '28px', borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.1)', position: 'sticky', top: '80px' }}>
                            <p className="label-caps" style={{ marginBottom: '20px' }}>Resumen del Pedido</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span className="text-secondary">Subtotal ({itemCount} items)</span>
                                <span style={{ fontWeight: 600 }}>${new Intl.NumberFormat('es-CO').format(total)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <span className="text-secondary">Envío Estimado</span>
                                <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>$6.000</span>
                            </div>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '20px' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                                <span className="label-caps">Total a Pagar</span>
                                <span style={{ color: 'var(--text-primary)', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                                    ${new Intl.NumberFormat('es-CO').format(total + 6000)}
                                </span>
                            </div>

                            <button onClick={handleProceedToCheckout} disabled={validando} className="btn-primary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center', marginTop: '24px', fontSize: '1.05rem', border: 'none', cursor: validando ? 'not-allowed' : 'pointer', opacity: validando ? 0.7 : 1 }}>
                                {validando ? 'Verificando stock...' : 'Proceder al Checkout'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="bottom-nav">
                <Link to="/" className="nav-item">
                    <span className="material-icons-round">home</span>
                    <span>Inicio</span>
                </Link>
                <Link to="/carrito" className="nav-item active">
                    <span className="material-icons-round">shopping_cart</span>
                    <span>Carrito</span>
                </Link>
                <Link to="/contacto" className="nav-item">
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

export default CartPage;
