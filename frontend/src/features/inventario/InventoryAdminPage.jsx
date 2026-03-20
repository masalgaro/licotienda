import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const InventoryAdminPage = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [editando, setEditando] = useState(null);
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: 0, categoria: '', descripcion: '', esta_activo: true });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // For admin, we might need a token, but for now we follow the user's project state
                const [prodRes, catRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/v1/inventario/productos/'),
                    axios.get('http://127.0.0.1:8000/api/v1/inventario/categorias/')
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
        try {
            await axios.put(`http://127.0.0.1:8000/api/v1/inventario/productos/${id}/`, { esta_activo: !status });
            setProductos(productos.map(p => p.id === id ? { ...p, esta_activo: !status } : p));
        } catch (err) {
            alert("Error actualizando estado.");
        }
    };

    const eliminarProducto = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/inventario/productos/${id}/`);
            setProductos(productos.filter(p => p.id !== id));
        } catch (err) {
            alert("Error eliminando.");
        }
    };

    return (
        <div className="app-container" style={{ maxWidth: '800px' }}>
            <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Panel de Inventario</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Gestión de Productos (David)</p>
                </div>
                <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }}>
                    + Nuevo Producto
                </button>
            </header>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--surface-2)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <tr>
                            <th style={{ padding: '15px' }}>PRODUCTO</th>
                            <th style={{ padding: '15px' }}>PRECIO</th>
                            <th style={{ padding: '15px' }}>CATEGORÍA</th>
                            <th style={{ padding: '15px' }}>ESTADO</th>
                            <th style={{ padding: '15px' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'var(--bg-black)', borderRadius: '8px', overflow: 'hidden' }}>
                                            <img src={p.imagen_url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.nombre}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '15px' }}>${new Intl.NumberFormat('es-CO').format(p.precio)}</td>
                                <td style={{ padding: '15px', fontSize: '0.8rem' }}>{p.categoria_nombre || 'Sin cat.'}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ 
                                        padding: '4px 10px', 
                                        borderRadius: '20px', 
                                        fontSize: '10px', 
                                        fontWeight: 800,
                                        background: p.esta_activo ? 'rgba(57, 181, 74, 0.2)' : 'rgba(255, 77, 77, 0.2)',
                                        color: p.esta_activo ? 'var(--primary-green)' : 'var(--error)'
                                    }}>
                                        {p.esta_activo ? 'ACTIVO' : 'AGOTADO'}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => toggleStatus(p.id, p.esta_activo)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                            <span className="material-icons-round" style={{ fontSize: '20px' }}>visibility_off</span>
                                        </button>
                                        <button onClick={() => eliminarProducto(p.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                                            <span className="material-icons-round" style={{ fontSize: '20px' }}>delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryAdminPage;
