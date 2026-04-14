import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Plus, 
    ToggleLeft, 
    ToggleRight, 
    Edit2, 
    Trash2 
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

const InventoryAdminPage = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    
    // UI State
    const [showModal, setShowModal] = useState(false);
    const [showCatModal, setShowCatModal] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [editingCatId, setEditingCatId] = useState(null);
    const [editCatName, setEditCatName] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentProduct, setCurrentProduct] = useState({
        nombre: '', precio: '', existencias: 1, imagen: null, categoria: '', esta_activo: true
    });

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/v1/inventario/productos/'),
                axios.get('http://127.0.0.1:8000/api/v1/inventario/categorias/')
            ]);
            setProductos(prodRes.data);
            setCategorias(catRes.data);
        } catch (_err) {
            console.error("Error admin fetching:", _err);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, []);

    const stats = {
        total: productos.length,
        categorias: categorias.length,
        activos: productos.filter(p => p.esta_activo).length
    };

    const handleToggleActive = async (id, status) => {
        try {
            const res = await axios.put(`http://127.0.0.1:8000/api/v1/inventario/productos/${id}/`, {
                esta_activo: !status
            });
            if (res.status === 200) {
                setProductos(productos.map(p => p.id === id ? { ...p, esta_activo: !status } : p));
            }
        } catch {
            alert("Error al cambiar estado");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/inventario/productos/${id}/`);
            setProductos(productos.filter(p => p.id !== id));
        } catch (_err) {
            alert(_err.response?.data?.detail || "Error al eliminar");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('nombre', currentProduct.nombre);
        formData.append('precio', parseFloat(currentProduct.precio));
        formData.append('existencias', parseInt(currentProduct.existencias));
        formData.append('esta_activo', currentProduct.esta_activo);
        
        if (currentProduct.categoria) {
            formData.append('categoria', currentProduct.categoria);
        }

        if (selectedFile) {
            formData.append('imagen', selectedFile);
        }

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (editMode) {
                await axios.put(`http://127.0.0.1:8000/api/v1/inventario/productos/${currentProduct.id}/`, formData, config);
            } else {
                await axios.post('http://127.0.0.1:8000/api/v1/inventario/productos/', formData, config);
            }
            setShowModal(false);
            setSelectedFile(null);
            fetchData();
        } catch (_err) {
            console.error("Save error:", _err.response?.data);
            alert("Error al guardar producto: " + JSON.stringify(_err.response?.data || "Error desconocido"));
        }
    };

    const handleNewProduct = () => {
        setCurrentProduct({ nombre: '', precio: '', existencias: 1, imagen: null, categoria: '', esta_activo: true });
        setSelectedFile(null);
        setEditMode(false);
        setShowModal(true);
    };

    const handleNewCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/v1/inventario/categorias/', { nombre: newCatName });
            setNewCatName('');
            fetchData();
        } catch (_err) {
            alert("Error al crear categoría: " + JSON.stringify(_err.response?.data || "Error"));
        }
    };

    const handleEditCategory = async (cat) => {
        if (editingCatId === cat.id) {
            try {
                await axios.put(`http://127.0.0.1:8000/api/v1/inventario/categorias/${cat.id}/`, { nombre: editCatName });
                setEditingCatId(null);
                fetchData();
            } catch(_err) {
                alert("Error al editar: " + JSON.stringify(_err.response?.data || "Error."));
            }
        } else {
            setEditingCatId(cat.id);
            setEditCatName(cat.nombre);
        }
    };

    const handleDeleteCategory = async (id) => {
        const confirmText = window.prompt("¿Eliminar esta categoría? Esto fallará si tiene productos.\nEscribe 'ELIMINAR' para confirmar:");
        if (confirmText !== 'ELIMINAR') {
            alert("Eliminación cancelada.");
            return;
        }
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/inventario/categorias/${id}/`);
            fetchData();
        } catch(_e) {
            alert(_e.response?.data?.error || JSON.stringify(_e.response?.data || "Error al eliminar."));
        }
    };

    const handleEditProduct = (p) => {
        setCurrentProduct(p);
        setSelectedFile(null);
        setEditMode(true);
        setShowModal(true);
    };

    return (
        <>
            <div className="app-container animate-fade">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-xxl)' }}>
                    <div>
                        <span className="label-caps" style={{ color: 'var(--primary-green)' }}>Módulo Administrativo</span>
                        <h1 style={{ margin: '8px 0 0 0' }}>Cava de Inventario</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                            className="btn-primary" 
                            style={{ width: 'auto', padding: '12px 24px', background: 'var(--surface-high)', color: 'var(--primary-green)', border: '1px solid var(--primary-green)', boxShadow: '0 0 15px rgba(0,255,140,0.1)', display: 'flex', gap: '8px' }}
                            onClick={() => setShowCatModal(true)}
                        >
                            <Plus size={20} /> Categorías
                        </button>
                        <button 
                            className="btn-primary" 
                            style={{ width: 'auto', padding: '12px 24px', display: 'flex', gap: '8px' }}
                            onClick={handleNewProduct}
                        >
                            <Plus size={20} /> Nuevo Producto
                        </button>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                    <div className="glass-card">
                        <span className="label-caps">Total Productos</span>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-green)', marginTop: '8px' }}>{stats.total}</div>
                    </div>
                    <div className="glass-card">
                        <span className="label-caps">Categorías</span>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-green)', marginTop: '8px' }}>{stats.categorias}</div>
                    </div>
                    <div className="glass-card">
                        <span className="label-caps">Activos</span>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-green)', marginTop: '8px' }}>{stats.activos}</div>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="admin-table-container">
                        <table style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                                    <th style={{ padding: '20px', color: 'var(--text-secondary)' }} className="label-caps">Producto</th>
                                    <th style={{ padding: '20px', color: 'var(--text-secondary)' }} className="label-caps">Precio</th>
                                    <th style={{ padding: '20px', color: 'var(--text-secondary)' }} className="label-caps">Stock</th>
                                    <th style={{ padding: '20px', color: 'var(--text-secondary)' }} className="label-caps">Estado</th>
                                    <th style={{ padding: '20px', color: 'var(--text-secondary)', textAlign: 'right' }} className="label-caps">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map(p => (
                                    <motion.tr 
                                        key={p.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.03 }}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                                    >
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--surface-high)', overflow: 'hidden' }}>
                                                    <img 
                                                        src={p.imagen ? (p.imagen.startsWith('http') ? p.imagen : `${API_BASE_URL}${p.imagen}`) : (p.imagen_url || '/placeholder.png')} 
                                                        alt={p.nombre} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                                                    />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>{p.nombre}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                        {categorias.find(c => c.id === p.categoria)?.nombre || 'Sin categoría'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px', fontWeight: '600' }}>
                                            ${new Intl.NumberFormat('es-CO').format(p.precio)}
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontWeight: '500' }}>{p.existencias} und</span>
                                                {p.existencias <= 5 && p.existencias > 0 && (
                                                    <span style={{ background: 'rgba(255, 60, 60, 0.1)', color: 'var(--error)', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '12px', fontWeight: '800', textTransform: 'uppercase' }}>
                                                        ¡Stock Bajo!
                                                    </span>
                                                )}
                                                {p.existencias === 0 && (
                                                    <span style={{ background: 'rgba(255, 60, 60, 0.1)', color: 'var(--error)', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '12px', fontWeight: '800', textTransform: 'uppercase' }}>
                                                        Agotado
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <button 
                                                onClick={() => handleToggleActive(p.id, p.esta_activo)}
                                                style={{ 
                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                    color: p.esta_activo ? 'var(--primary-green)' : 'var(--text-secondary)',
                                                    display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem'
                                                }}
                                            >
                                                {p.esta_activo ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                                {p.esta_activo ? 'Activo' : 'Pausado'}
                                            </button>
                                        </td>
                                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                <button 
                                                    className="btn-icon" 
                                                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}
                                                    onClick={() => handleEditProduct(p)}
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    className="btn-icon" 
                                                    style={{ background: 'rgba(213, 61, 24, 0.1)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: 'var(--error)' }}
                                                    onClick={() => handleDelete(p.id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="glass-card" 
                            style={{ width: '100%', maxWidth: '500px', padding: 'var(--spacing-xl)', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>{editMode ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                            <form onSubmit={handleSave}>
                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <label className="label-caps">Nombre del Producto</label>
                                    <input 
                                        type="text" className="premium-input" required 
                                        value={currentProduct.nombre}
                                        onChange={e => setCurrentProduct({...currentProduct, nombre: e.target.value})}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                                    <div>
                                        <label className="label-caps">Precio ($)</label>
                                        <input 
                                            type="number" className="premium-input" required 
                                            value={currentProduct.precio}
                                            onChange={e => setCurrentProduct({...currentProduct, precio: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="label-caps">Existencias (und)</label>
                                        <input 
                                            type="number" className="premium-input" required 
                                            value={currentProduct.existencias}
                                            onChange={e => setCurrentProduct({...currentProduct, existencias: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <label className="label-caps">Cargar Imagen</label>
                                    <input 
                                        type="file" className="premium-input" 
                                        accept="image/*"
                                        required={!editMode}
                                        onChange={e => setSelectedFile(e.target.files[0])}
                                        style={{ padding: '10px' }}
                                    />
                                    {editMode && currentProduct.imagen && !selectedFile && (
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                            Imagen actual: {currentProduct.imagen.split('/').pop()}
                                        </div>
                                    )}
                                </div>
                                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                    <label className="label-caps">Categoría</label>
                                    <select 
                                        className="premium-input" required
                                        value={currentProduct.categoria || ''}
                                        onChange={e => setCurrentProduct({...currentProduct, categoria: e.target.value})}
                                        style={{ appearance: 'none' }}
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {categorias.map(c => (
                                            <option key={c.id} value={c.id}>{c.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                    <button type="button" className="btn-primary" style={{ background: 'var(--surface-high)', color: 'var(--text-primary)', boxShadow: 'none' }} onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCatModal && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="glass-card" 
                            style={{ width: '100%', maxWidth: '400px', padding: 'var(--spacing-xl)' }}
                        >
                            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                                <h2 style={{ margin: 0 }}>Gestionar Categorías</h2>
                                <button type="button" onClick={() => setShowCatModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                    <span className="material-icons-round">close</span>
                                </button>
                            </header>
                            
                            <div className="hide-scrollbar" style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '20px', border: '1px solid var(--glass-border)', padding: '8px', borderRadius: '12px' }}>
                                {categorias.map(c => (
                                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--surface-low)', marginBottom: '8px', borderRadius: '8px' }}>
                                        {editingCatId === c.id ? (
                                            <input 
                                                autoFocus
                                                type="text" 
                                                className="premium-input" 
                                                value={editCatName} 
                                                onChange={e => setEditCatName(e.target.value)} 
                                                style={{ padding: '8px', flex: 1, marginRight: '12px' }} 
                                            />
                                        ) : (
                                            <span style={{ fontWeight: 600 }}>{c.nombre}</span>
                                        )}
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button type="button" onClick={() => handleEditCategory(c)} className="btn-icon" style={{ background: editingCatId === c.id ? 'var(--primary-green)' : 'rgba(255,255,255,0.05)', color: editingCatId === c.id ? 'black' : 'white', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                                                {editingCatId === c.id ? <span className="material-icons-round" style={{fontSize:'16px'}}>check</span> : <Edit2 size={16} />}
                                            </button>
                                            <button type="button" onClick={() => handleDeleteCategory(c.id)} className="btn-icon" style={{ background: 'rgba(213, 61, 24, 0.1)', color: 'var(--error)', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {categorias.length === 0 && (
                                    <p style={{ textAlign: 'center', margin: '20px 0', color: 'var(--text-secondary)' }}>No hay categorías registradas.</p>
                                )}
                            </div>

                            <form onSubmit={handleNewCategory}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input 
                                        type="text" className="premium-input" required 
                                        value={newCatName}
                                        onChange={e => setNewCatName(e.target.value)}
                                        placeholder="Nueva categoría..."
                                        style={{ flex: 1 }}
                                    />
                                    <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 20px' }}>
                                        Añadir
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
        </>
    );
};

export default InventoryAdminPage;
