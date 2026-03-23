import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const InventoryAdminPage = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/v1/catalogo/productos/'),
                    axios.get('http://127.0.0.1:8000/api/v1/catalogo/categorias/')
                ]);
                setProductos(prodRes.data);
                setCategorias(catRes.data);
            } catch (err) {
                console.error("Error admin fetching:", err);
            } finally {
                setCargando(false);
            }
        };
        fetchData();
    }, []);

    const toggleStatus = async (id, status) => {
        setProductos(productos.map(p => p.id === id ? { ...p, esta_activo: !status } : p));
    };

    return (
        <div className="app-container animate-fade">
            <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <p className="label-caps" style={{ color: 'var(--primary-green)', marginBottom: '8px' }}>Módulo Administrativo</p>
                    <h1 className="display-lg" style={{ margin: 0 }}>Cava de Inventario</h1>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary" 
                    style={{ width: 'auto', padding: '14px 28px', borderRadius: '14px' }}
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="material-icons-round">add_circle</span>
                        Nuevo Producto
                    </span>
                </motion.button>
            </header>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '20px', margin: 0 }}>
                    <p className="label-caps" style={{ marginBottom: '8px' }}>Total Productos</p>
                    <p style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-highlight)' }}>{productos.length}</p>
                </div>
                <div className="glass-card" style={{ padding: '20px', margin: 0 }}>
                    <p className="label-caps" style={{ marginBottom: '8px' }}>Categorías</p>
                    <p style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary-green)' }}>{categorias.length}</p>
                </div>
                <div className="glass-card" style={{ padding: '20px', margin: 0 }}>
                    <p className="label-caps" style={{ marginBottom: '8px' }}>Activos</p>
                    <p style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--success)' }}>{productos.filter(p => p.esta_activo).length}</p>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card admin-table-container" style={{ padding: 0, border: '1px solid rgba(255,255,255,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                    <thead style={{ background: 'var(--surface-low)', height: '56px' }}>
                        <tr>
                            <th style={{ padding: '0 24px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>PRODUCTO</th>
                            <th style={{ padding: '0 24px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>PRECIO</th>
                            <th style={{ padding: '0 24px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>CATEGORÍA</th>
                            <th style={{ padding: '0 24px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>ESTADO</th>
                            <th style={{ padding: '0 24px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', textAlign: 'right' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {productos.map((p, idx) => (
                                <motion.tr 
                                    key={p.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', height: '76px' }}
                                >
                                    <td style={{ padding: '0 24px' }}>
                                        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                            <div style={{ width: '46px', height: '46px', background: 'var(--surface-highest)', borderRadius: '10px', overflow: 'hidden', padding: '4px', flexShrink: 0 }}>
                                                <img src={p.imagen_url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>{p.nombre}</p>
                                                <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>SKU: {String(p.id).padStart(6, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0 24px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--primary-green)' }}>
                                        ${new Intl.NumberFormat('es-CO').format(p.precio)}
                                    </td>
                                    <td style={{ padding: '0 24px' }}>
                                        <span style={{ fontSize: '0.75rem', background: 'var(--surface-high)', padding: '5px 14px', borderRadius: '8px', color: 'var(--text-secondary)' }}>
                                            {p.categoria_nombre || 'General'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.esta_activo ? 'var(--primary-green)' : '#555' }}></div>
                                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: p.esta_activo ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                                {p.esta_activo ? 'ACTIVO' : 'PAUSADO'}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <motion.button 
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => toggleStatus(p.id, p.esta_activo)} 
                                                style={{ background: 'var(--surface-high)', border: 'none', borderRadius: '8px', width: '36px', height: '36px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <span className="material-icons-round" style={{ fontSize: '18px' }}>{p.esta_activo ? 'visibility' : 'visibility_off'}</span>
                                            </motion.button>
                                            <motion.button 
                                                whileTap={{ scale: 0.9 }}
                                                style={{ background: 'rgba(213, 61, 24, 0.1)', border: 'none', borderRadius: '8px', width: '36px', height: '36px', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <span className="material-icons-round" style={{ fontSize: '18px' }}>delete_outline</span>
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {productos.length === 0 && !cargando && (
                <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--surface-dim)', borderRadius: '24px', marginTop: '24px', border: '1px dashed rgba(255,255,255,0.05)' }}>
                    <span className="material-icons-round" style={{ fontSize: '56px', color: 'var(--surface-high)', marginBottom: '16px', display: 'block' }}>inventory_2</span>
                    <h2 className="headline-md" style={{ opacity: 0.4 }}>La cava está vacía</h2>
                    <p className="text-secondary">Empieza agregando productos para verlos en el catálogo.</p>
                </div>
            )}
            
            {/* Footer */}
            <footer style={{ textAlign: 'center', padding: '40px', opacity: 0.3, fontSize: '0.7rem' }}>
                ADMIN PANEL v2.0 • LA LICO ITAGÜÍ
            </footer>

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
                <Link to="/contacto" className="nav-item">
                    <span className="material-icons-round">info</span>
                    <span>Info</span>
                </Link>
                <Link to="/admin/inventario" className="nav-item active">
                    <span className="material-icons-round">inventory_2</span>
                    <span>Admin</span>
                </Link>
            </nav>
        </div>
    );
};

export default InventoryAdminPage;
