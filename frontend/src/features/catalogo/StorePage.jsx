import React, { useState, useEffect } from 'react';
import { WHATSAPP_SOPORTE } from '../../config';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

import { useCart } from '../../shared/cartHooks';

const API_BASE_URL = 'http://127.0.0.1:8000';
const buildCatalogUrl = (query, categoriaId, soloOfertas) => {
    const params = new URLSearchParams();

    if (query) {
        params.set('q', query);
    }

    if (categoriaId) {
        params.set('categoria', categoriaId);
    }

    if (soloOfertas) {
        params.set('en_oferta', 'true');
    }

    const queryString = params.toString();
    return `${API_BASE_URL}/api/v1/catalogo/productos/${queryString ? `?${queryString}` : ''}`;
};

const StorePage = () => {
    const navigate = useNavigate();
    const { itemCount, addToCart, total } = useCart();
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [soloOfertas, setSoloOfertas] = useState(false);
    const [cargando, setCargando] = useState(true);

    const fetchProductos = async ({
        query = busqueda,
        categoriaId = categoriaSeleccionada,
        ofertas = soloOfertas,
        showLoading = true
    } = {}) => {
        if (showLoading) {
            setCargando(true);
        }

        try {
            const res = await axios.get(buildCatalogUrl(query, categoriaId, ofertas));
            setProductos(res.data);
        } catch (error) {
            console.error("Error cargando productos:", error);
        } finally {
            if (showLoading) {
                setCargando(false);
            }
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    axios.get(buildCatalogUrl('', null, false)),
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
        await fetchProductos({
            query: val,
            categoriaId: categoriaSeleccionada,
            ofertas: soloOfertas
        });
    };

    const filtrarPorCategoria = async (id) => {
        setCategoriaSeleccionada(id);
        await fetchProductos({
            query: busqueda,
            categoriaId: id,
            ofertas: soloOfertas
        });
    };

    const toggleSoloOfertas = async () => {
        const nextSoloOfertas = !soloOfertas;
        setSoloOfertas(nextSoloOfertas);
        await fetchProductos({
            query: busqueda,
            categoriaId: categoriaSeleccionada,
            ofertas: nextSoloOfertas
        });
    };

    const infoRef = React.useRef(null);

    const scrollToInfo = (e) => {
        e.preventDefault();
        infoRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* Top Desktop Navigation - Matching screenshot */}
            <nav style={{ 
                position: 'sticky', 
                top: 0, 
                zIndex: 1100, 
                background: 'rgba(0,0,0,0.8)', 
                backdropFilter: 'blur(20px)', 
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'center',
                gap: '40px'
            }}>
                <Link to="/" style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', 
                    textDecoration: 'none', color: 'var(--primary-green)', fontWeight: 700, fontSize: '0.85rem' 
                }}>
                    <span className="material-icons-round" style={{ fontSize: '20px' }}>home</span> INICIO
                </Link>
                <Link to="/carrito" style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', 
                    textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' 
                }}>
                    <span className="material-icons-round" style={{ fontSize: '20px' }}>shopping_cart</span> CARRITO
                </Link>
                <Link to="/rastreo" style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem'
                }}>
                    <span className="material-icons-round" style={{ fontSize: '20px' }}>location_searching</span> RASTREO
                </Link>
                <a href="#info" onClick={scrollToInfo} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem'
                }}>
                    <span className="material-icons-round" style={{ fontSize: '20px' }}>info</span> INFO
                </a>
            </nav>

            <div className="app-container animate-fade">
                {/* Header / Brand */}
                <header style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <img 
                        src="/logo_lalico.jpeg" 
                        alt="Logo LaLico" 
                        style={{ 
                            width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover',
                            border: '2px solid var(--glass-border)',
                            boxShadow: 'var(--shadow-glow)'
                        }} 
                    />
                    <div>
                        <h1 className="display-lg" style={{ color: 'var(--primary-green)', margin: 0, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>LaLico</h1>
                        <p className="label-caps" style={{ margin: 0 }}>Premium Liquor Store • Itagüí</p>
                    </div>
                </header>

                {/* INFO SECTION INTEGRATED - MOVED TO TOP OF CONTENT */}
                <motion.div 
                    ref={infoRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '40px', background: 'var(--surface-low)', borderRadius: '32px', padding: '32px', border: '1px solid var(--glass-border)' }}
                >
                    <div className="checkout-grid" style={{ gap: '32px', alignItems: 'start' }}>
                        <div>
                           <div style={{ marginBottom: '24px' }}>
                                <p className="label-caps" style={{ color: 'var(--primary-green)', marginBottom: '12px' }}>Nuestra Sede</p>
                                <h3 className="display-sm" style={{ marginBottom: '8px', fontSize: '1.5rem' }}>Itagüí, Calatrava</h3>
                                <p className="text-secondary" style={{ fontSize: '0.95rem' }}>Carrera 68 #61-88</p>
                           </div>

                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                                <a href={`https://wa.me/${WHATSAPP_SOPORTE}`} target="_blank" rel="noreferrer" className="glass-card" style={{ padding: '16px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(37, 211, 102, 0.05)' }}>
                                    <span className="material-icons-round" style={{ color: '#25D366', fontSize: '20px' }}>message</span>
                                    <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>WhatsApp</span>
                                </a>
                                <a href="https://instagram.com/lalico.virtual" target="_blank" rel="noreferrer" className="glass-card" style={{ padding: '16px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(220, 39, 67, 0.05)' }}>
                                    <span className="material-icons-round" style={{ color: '#dc2743', fontSize: '20px' }}>camera_alt</span>
                                    <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>Instagram</span>
                                </a>
                           </div>

                           <div style={{ padding: '16px', background: 'var(--surface-highest)', borderRadius: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '0.8rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Viernes:</span> <span style={{ fontWeight: 600 }}>6:00 PM - 1:00 AM</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>Sábado:</span> <span style={{ fontWeight: 600 }}>6:00 PM - 2:00 AM</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>Domingo:</span> <span style={{ fontWeight: 600 }}>4:00 PM - 10:00 PM</span>
                                </div>
                           </div>
                        </div>

                        {/* MAPA */}
                        <div className="glass-card" style={{ padding: '6px', height: '240px', overflow: 'hidden' }}>
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d-75.613862!3d6.194032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4682055608c0ef%3A0xc319106093be8e45!2sCra.%2068%20%2361-88%2C%20Itag%C3%BCi%2C%20Antioquia!5e0!3m2!1ses-419!2sco!4v1700000000000!5m2!1ses-419!2sco" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0, borderRadius: '20px', filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} 
                                allowFullScreen="" 
                                loading="lazy" 
                            ></iframe>
                        </div>
                    </div>
                </motion.div>

                {/* Granizado Builder Banner */}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/armar-granizado')}
                    style={{
                        background: 'linear-gradient(135deg, rgba(57, 181, 74, 0.15) 0%, rgba(0,0,0,0.5) 100%)',
                        border: '1px solid var(--primary-green)',
                        borderRadius: '24px', padding: '24px', marginBottom: '32px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '24px',
                        position: 'relative', overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1, transform: 'rotate(15deg)' }}>
                        <span className="material-icons-round" style={{ fontSize: '150px', color: 'var(--primary-green)' }}>local_drink</span>
                    </div>
                    <div style={{ background: 'var(--surface-high)', padding: '16px', borderRadius: '16px', zIndex: 1 }}>
                        <span className="material-icons-round" style={{ fontSize: '32px', color: 'var(--primary-green)' }}>local_drink</span>
                    </div>
                    <div style={{ zIndex: 1 }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px 0' }}>¡Arma tu Granizado!</h2>
                        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Personaliza tu bebida con tus licores y toppings favoritos.</p>
                    </div>
                </motion.div>

                {/* Search Section */}
                <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '600px' }}>
                    <span className="material-icons-round" style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-secondary)', fontSize: '20px' }}>search</span>
                    <input 
                        type="text" 
                        placeholder="Busca tu licor favorito..." 
                        className="premium-input"
                        style={{ paddingLeft: '48px' }}
                        value={busqueda}
                        onChange={handleSearch}
                    />
                </div>

                <div className="hide-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
                    <CategoryPill
                        label="Ofertas"
                        active={soloOfertas}
                        onClick={toggleSoloOfertas}
                    />
                </div>

                {/* Categorías Slider */}
                <div className="hide-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '36px', paddingBottom: '4px', flexWrap: 'wrap' }}>
                    <CategoryPill 
                        label="Todos" 
                        active={categoriaSeleccionada === null}
                        onClick={() => filtrarPorCategoria(null)}
                    />
                    {categorias.map(cat => (
                        <CategoryPill 
                            key={cat.id}
                            label={cat.nombre} 
                            active={categoriaSeleccionada === cat.id}
                            onClick={() => filtrarPorCategoria(cat.id)}
                        />
                    ))}
                </div>

                {/* Product Grid */}
                <AnimatePresence mode="popLayout">
                    <motion.div layout className="product-grid">
                        {productos.map(producto => (
                            <ProductCard key={producto.id} producto={producto} addToCart={addToCart} />
                        ))}
                    </motion.div>
                </AnimatePresence>
                
                {cargando && (
                    <div className="product-grid" style={{ marginTop: '16px' }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: '280px' }} />
                        ))}
                    </div>
                )}

                {!cargando && productos.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
                        <span className="material-icons-round" style={{ fontSize: '56px', color: 'var(--surface-highest)', marginBottom: '16px', display: 'block' }}>liquor</span>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', opacity: 0.7 }}>
                            {soloOfertas ? 'No encontramos ofertas con esos filtros.' : 'No encontramos nada similar.'}
                        </p>
                        <p style={{ fontSize: '0.85rem', marginTop: '8px', opacity: 0.4 }}>
                            {soloOfertas
                                ? 'Prueba otra categoría o desactiva el filtro de ofertas'
                                : 'Intenta con otro término de búsqueda'}
                        </p>
                    </div>
                )}
            </div>

            {/* Floating Cart Button - Truly Fixed */}
            {itemCount > 0 && (
                <div id="floating-cart" style={{ 
                    position: 'fixed', 
                    bottom: 'min(90px, 10vh)', 
                    left: 0, 
                    right: 0, 
                    zIndex: 2000, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    pointerEvents: 'none',
                    filter: 'drop-shadow(0 -10px 40px rgba(0,0,0,0.5))'
                }}>
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                        style={{ width: '92%', maxWidth: '500px', pointerEvents: 'auto' }}
                    >
                        <Link to="/carrito" className="btn-primary" style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            textDecoration: 'none', 
                            width: '100%', 
                            padding: '20px 28px', 
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #7ff984 0%, #39B54A 100%)',
                            boxShadow: '0 12px 48px rgba(57, 181, 74, 0.4), inset 0 1px 1px rgba(255,255,255,0.4)',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ background: 'rgba(0,0,0,0.1)', padding: '8px', borderRadius: '12px', display: 'flex' }}>
                                    <span className="material-icons-round" style={{ fontSize: '24px' }}>shopping_bag</span>
                                </div>
                                <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>Ver mi carrito ({itemCount})</span>
                            </div>
                            <span style={{ fontWeight: 900, fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
                                ${new Intl.NumberFormat('es-CO').format(total)}
                            </span>
                        </Link>
                    </motion.div>
                </div>
            )}

            {/* Navigation - Adaptive Top/Bottom */}
            <nav className="bottom-nav" style={{ boxShadow: '0 -10px 40px rgba(0,0,0,0.3)' }}>
                <Link to="/" className="nav-item active">
                    <span className="material-icons-round">home</span>
                    <span>Inicio</span>
                </Link>
                <Link to="/carrito" className="nav-item">
                    <span className="material-icons-round">shopping_cart</span>
                    <span style={{ position: 'relative' }}>
                        Carrito
                        {itemCount > 0 && <span style={{ position: 'absolute', top: '-18px', right: '-12px', background: 'var(--primary-green)', color: 'black', fontSize: '10px', fontWeight: 900, padding: '2px 6px', borderRadius: '10px', minWidth: '18px', textAlign: 'center', border: '2px solid black' }}>{itemCount}</span>}
                    </span>
                </Link>
                <Link to="/rastreo" className="nav-item">
                    <span className="material-icons-round">location_searching</span>
                    <span>Rastreo</span>
                </Link>
                <a href="#info" onClick={scrollToInfo} className="nav-item">
                    <span className="material-icons-round">info</span>
                    <span>Info</span>
                </a>
            </nav>
        </>
    );
};

/* ======== Sub-Components ======== */

const CategoryPill = ({ label, active, onClick }) => (
    <button 
        onClick={onClick}
        style={{
            padding: '10px 22px',
            borderRadius: '24px',
            border: `1px solid ${active ? 'var(--primary-green)' : 'rgba(255,255,255,0.06)'}`,
            background: active ? 'var(--primary-green)' : 'var(--surface-low)',
            color: active ? 'var(--bg-black)' : 'var(--text-primary)',
            fontSize: '0.82rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'var(--transition)',
            fontFamily: 'var(--font-body)',
        }}
    >
        {label}
    </button>
);

const ProductCard = ({ producto, addToCart }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
            className="glass-card" 
            style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'default', position: 'relative' }}
        >
            {producto.en_oferta && (
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--primary-green)', color: '#000', padding: '6px 14px', borderRadius: '40px', fontWeight: 900, fontSize: '0.75rem', boxShadow: '0 4px 15px rgba(0, 255, 140, 0.4)', zIndex: 10, border: '2px solid #000' }}>
                    -{producto.descuento_porcentaje}%
                </div>
            )}
            {/* Product Image */}
            <div style={{ 
                height: '160px', 
                background: 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(20,20,20,0.8) 100%)', 
                borderRadius: 'var(--radius-md)', 
                overflow: 'hidden', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative'
            }}>
                {!imgError ? (
                    <img 
                        src={producto.imagen ? (producto.imagen.startsWith('http') ? producto.imagen : `${API_BASE_URL}${producto.imagen}`) : (producto.imagen_url || '/placeholder.png')} 
                        alt={producto.nombre} 
                        style={{ width: '80%', height: '80%', objectFit: 'contain', transition: 'transform 0.4s ease' }}
                        onError={() => setImgError(true)}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.08)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                ) : (
                    <span className="material-icons-round" style={{ fontSize: '48px', color: 'var(--surface-highest)' }}>liquor</span>
                )}
            </div>
            
            {/* Product Info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <p className="label-caps" style={{ color: 'var(--text-highlight)', marginBottom: '4px', fontSize: '0.6rem' }}>
                        {producto.categoria_nombre}
                    </p>
                    <h3 style={{ fontSize: '0.88rem', marginBottom: '8px', lineHeight: '1.25', fontWeight: 600 }}>
                        {producto.nombre}
                    </h3>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {producto.en_oferta && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'line-through', marginBottom: '-2px' }}>
                                ${new Intl.NumberFormat('es-CO').format(producto.precio)}
                            </span>
                        )}
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: producto.en_oferta ? 'var(--primary-green)' : 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                            ${new Intl.NumberFormat('es-CO').format(producto.en_oferta ? (producto.precio - (producto.precio * producto.descuento_porcentaje / 100)) : producto.precio)}
                        </span>
                    </div>
                    {producto.existencias === 0 ? (
                        <span style={{ color: 'var(--error)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', border: '1px solid var(--error)', padding: '4px 8px', borderRadius: '4px' }}>
                            Agotado
                        </span>
                    ) : (
                        <button 
                            style={{ 
                                background: 'var(--surface-highest)', 
                                border: '1px solid var(--glass-border)', 
                                borderRadius: '10px', 
                                width: '38px', 
                                height: '38px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--primary-green)',
                                transition: 'var(--transition)',
                            }}
                            onClick={() => addToCart(producto)}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary-green)'; e.currentTarget.style.color = '#000'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'var(--surface-highest)'; e.currentTarget.style.color = 'var(--primary-green)'; }}
                        >
                            <span className="material-icons-round" style={{ fontSize: '20px' }}>add</span>
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default StorePage;
