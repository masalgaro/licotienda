import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import { useCart } from '../../shared/CartContext';

const StorePage = () => {
    const { itemCount, addToCart, total } = useCart();
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/v1/catalogo/productos/'),
                    axios.get('http://127.0.0.1:8000/api/v1/catalogo/categorias/')
                ]);
                setProductos(prodRes.data);
                setCategorias(catRes.data);
            } catch (error) {
                console.error("Error cargando el catálogo:", error);
            } finally {
                setCargando(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleSearch = async (e) => {
        const val = e.target.value;
        setBusqueda(val);
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/v1/catalogo/productos/?q=${val}${categoriaSeleccionada ? `&categoria=${categoriaSeleccionada}` : ''}`);
            setProductos(res.data);
        } catch (error) {
            console.error("Error en búsqueda:", error);
        }
    };

    const filtrarPorCategoria = async (id) => {
        setCategoriaSeleccionada(id);
        setCargando(true);
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/v1/catalogo/productos/?categoria=${id || ''}${busqueda ? `&q=${busqueda}` : ''}`);
            setProductos(res.data);
        } catch (error) {
            console.error("Error filtrando por categoría:", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="app-container" style={{ padding: 0 }}>
            {/* Header / Nav */}
            <div style={{ padding: '30px 20px 10px', background: 'var(--bg-black)', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary-green)' }}>LaLico</h1>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Itagüí, Antioquia</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Link to="/contacto" style={{ color: 'white', textDecoration: 'none' }}>
                            <span className="material-icons-round">info</span>
                        </Link>
                        <Link to="/carrito" style={{ color: 'white', textDecoration: 'none', position: 'relative' }}>
                            <span className="material-icons-round">shopping_cart</span>
                            {itemCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: 'var(--primary-green)',
                                    color: 'black',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    fontWeight: 800
                                }}>
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Buscador */}
                <div style={{ position: 'relative' }}>
                    <span className="material-icons-round" style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-secondary)', fontSize: '20px' }}>search</span>
                    <input 
                        type="text" 
                        placeholder="Busca tu licor favorito..." 
                        style={{ paddingLeft: '45px', marginBottom: '10px' }}
                        value={busqueda}
                        onChange={handleSearch}
                    />
                </div>

                {/* Categorías */}
                <div className="hide-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}>
                    <button 
                        onClick={() => filtrarPorCategoria(null)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid var(--border-color)',
                            background: categoriaSeleccionada === null ? 'var(--primary-green)' : 'var(--surface-2)',
                            color: categoriaSeleccionada === null ? 'black' : 'white',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            transition: 'var(--transition)'
                        }}
                    >
                        Todos
                    </button>
                    {categorias.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => filtrarPorCategoria(cat.id)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: '1px solid var(--border-color)',
                                background: categoriaSeleccionada === cat.id ? 'var(--primary-green)' : 'var(--surface-2)',
                                color: categoriaSeleccionada === cat.id ? 'black' : 'white',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                transition: 'var(--transition)'
                            }}
                        >
                            {cat.nombre}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid de Productos */}
            <div style={{ padding: '10px 20px 100px' }}>
                <AnimatePresence mode="popLayout">
                    <motion.div 
                        layout
                        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}
                    >
                        {productos.map(producto => (
                            <ProductCard key={producto.id} producto={producto} addToCart={addToCart} />
                        ))}
                    </motion.div>
                </AnimatePresence>
                
                {!cargando && productos.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        <span className="material-icons-round" style={{ fontSize: '48px', marginBottom: '10px' }}>sentiment_dissatisfied</span>
                        <p>No encontramos nada similar.</p>
                    </div>
                )}
            </div>

            {/* Flotador de Carrito (si hay items) */}
            {itemCount > 0 && (
                <div style={{ position: 'fixed', bottom: '85px', left: 0, right: 0, padding: '0 20px', display: 'flex', justifyContent: 'center', zIndex: 90 }}>
                    <Link to="/carrito" className="btn-primary" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', boxShadow: '0 8px 32px rgba(57, 181, 74, 0.4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="material-icons-round">shopping_bag</span>
                            <span>Ver mi carrito ({itemCount})</span>
                        </div>
                        <span style={{ fontWeight: 800 }}>${new Intl.NumberFormat('es-CO').format(total)}</span>
                    </Link>
                </div>
            )}

            {/* Bottom Menu */}
            <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '500px', background: 'var(--bg-black)', borderTop: '1px solid var(--border-color)', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', zIndex: 100 }}>
                <Link to="/" style={{ color: 'var(--primary-green)', display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                    <span className="material-icons-round">home</span>
                    <span style={{ fontSize: '10px', fontWeight: 600 }}>Inicio</span>
                </Link>
                <Link to="/pedidos" style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                    <span className="material-icons-round">history</span>
                    <span style={{ fontSize: '10px', fontWeight: 600 }}>Pedidos</span>
                </Link>
                <Link to="/contacto" style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                    <span className="material-icons-round">info</span>
                    <span style={{ fontSize: '10px', fontWeight: 600 }}>Info</span>
                </Link>
            </div>
        </div>
    );
};

const ProductCard = ({ producto, addToCart }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            layout
            className="glass-card" 
            style={{ padding: '10px', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
            <div style={{ height: '120px', background: 'var(--bg-black)', borderRadius: '12px', marginBottom: '10px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={producto.imagen_url} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '5px' }} />
            </div>
            <div>
                <p style={{ fontSize: '0.65rem', color: 'var(--primary-green)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                    {producto.categoria_nombre}
                </p>
                <h3 style={{ fontSize: '0.85rem', marginBottom: '8px', lineHeight: '1.2', height: '2.4em', overflow: 'hidden' }}>
                    {producto.nombre}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-green)' }}>
                        ${new Intl.NumberFormat('es-CO').format(producto.precio)}
                    </span>
                    <button 
                        style={{ 
                            background: 'var(--primary-green)', 
                            border: 'none', 
                            borderRadius: '8px', 
                            width: '32px', 
                            height: '32px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                        onClick={() => addToCart(producto)}
                    >
                        <span className="material-icons-round" style={{ fontSize: '18px', color: 'black' }}>add</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default StorePage;
