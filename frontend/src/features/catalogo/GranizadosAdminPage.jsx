import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, LogOut, Plus, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const CATEGORIAS = [
    { value: 'fruta', label: 'Fruta' },
    { value: 'licor', label: 'Licor' },
    { value: 'complemento', label: 'Complemento' },
];

const EMPTY_FORM = {
    nombre: '',
    categoria: 'fruta',
    precio_adicional: '0',
    disponible: true,
};

const fmt = n => `$${new Intl.NumberFormat('es-CO').format(Number(n || 0))}`;

const CATEGORIA_BADGE = {
    fruta: { bg: 'rgba(100, 181, 246, 0.15)', color: '#64B5F6', label: 'Fruta' },
    licor: { bg: 'rgba(57, 181, 74, 0.15)', color: 'var(--primary-green)', label: 'Licor' },
    complemento: { bg: 'rgba(253, 189, 45, 0.15)', color: '#fdbd2d', label: 'Complemento' },
};

const GranizadosAdminPage = () => {
    const navigate = useNavigate();
    const [ingredientes, setIngredientes] = useState([]);
    const [filtro, setFiltro] = useState('todos');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [editId, setEditId] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const fetchIngredientes = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/v1/granizados/admin/ingredientes/`);
            setIngredientes(res.data);
        } catch (err) {
            console.error('Error cargando ingredientes:', err);
        }
    }, []);

    useEffect(() => {
        fetchIngredientes();
    }, [fetchIngredientes]);

    const filtrados = filtro === 'todos'
        ? ingredientes
        : ingredientes.filter(i => i.categoria === filtro);

    const stats = {
        total: ingredientes.length,
        disponibles: ingredientes.filter(i => i.disponible).length,
        agotados: ingredientes.filter(i => !i.disponible).length,
        fruta: ingredientes.filter(i => i.categoria === 'fruta').length,
        licor: ingredientes.filter(i => i.categoria === 'licor').length,
        complemento: ingredientes.filter(i => i.categoria === 'complemento').length,
    };

    const openCreate = () => {
        setEditMode(false);
        setFormData(EMPTY_FORM);
        setEditId(null);
        setShowModal(true);
    };

    const openEdit = ingrediente => {
        setEditMode(true);
        setFormData({
            nombre: ingrediente.nombre,
            categoria: ingrediente.categoria,
            precio_adicional: String(ingrediente.precio_adicional),
            disponible: ingrediente.disponible,
        });
        setEditId(ingrediente.id);
        setShowModal(true);
    };

    const handleToggleDisponible = async ingrediente => {
        try {
            const res = await axios.patch(
                `${API_BASE_URL}/api/v1/granizados/admin/ingredientes/${ingrediente.id}/`,
                { disponible: !ingrediente.disponible }
            );
            setIngredientes(prev => prev.map(i => (i.id === ingrediente.id ? res.data : i)));
        } catch (err) {
            console.error('Error toggling disponible:', err);
        }
    };

    const handleSave = async () => {
        if (!formData.nombre.trim()) return;
        setGuardando(true);
        try {
            const payload = {
                ...formData,
                precio_adicional: String(parseFloat(formData.precio_adicional) || 0),
            };
            if (editMode) {
                const res = await axios.patch(
                    `${API_BASE_URL}/api/v1/granizados/admin/ingredientes/${editId}/`,
                    payload
                );
                setIngredientes(prev => prev.map(i => (i.id === editId ? res.data : i)));
            } else {
                const res = await axios.post(
                    `${API_BASE_URL}/api/v1/granizados/admin/ingredientes/`,
                    payload
                );
                setIngredientes(prev => [...prev, res.data]);
            }
            setShowModal(false);
        } catch (err) {
            alert(
                err.response?.data?.nombre?.[0] ||
                err.response?.data?.detail ||
                'Error al guardar el ingrediente.'
            );
        } finally {
            setGuardando(false);
        }
    };

    const handleDelete = async id => {
        try {
            await axios.delete(`${API_BASE_URL}/api/v1/granizados/admin/ingredientes/${id}/`);
            setIngredientes(prev => prev.filter(i => i.id !== id));
            setConfirmDelete(null);
        } catch (err) {
            console.error('Error eliminando ingrediente:', err);
        }
    };

    return (
        <>
            <div className="app-container animate-fade">
                {/* Header */}
                <header
                    style={{
                        marginBottom: '40px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '16px',
                    }}
                >
                    <div>
                        <p
                            className="label-caps"
                            style={{ color: 'var(--primary-green)', marginBottom: '8px' }}
                        >
                            Módulo Administrativo
                        </p>
                        <h1 className="display-lg" style={{ margin: 0 }}>
                            Ingredientes Granizados
                        </h1>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            className="btn-primary"
                            onClick={openCreate}
                            style={{
                                width: 'auto',
                                padding: '12px 24px',
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'center',
                            }}
                        >
                            <Plus size={18} /> Nuevo Ingrediente
                        </button>
                        <button
                            className="btn-primary"
                            style={{
                                width: 'auto',
                                padding: '12px 24px',
                                background: 'var(--surface-high)',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'center',
                            }}
                            onClick={() => {
                                localStorage.removeItem('admin_token');
                                navigate('/admin/login', { replace: true });
                            }}
                        >
                            <LogOut size={20} /> Cerrar sesión
                        </button>
                    </div>
                </header>

                {/* Stats */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '16px',
                        marginBottom: '32px',
                    }}
                >
                    {[
                        { label: 'Total', value: stats.total },
                        { label: 'Disponibles', value: stats.disponibles },
                        { label: 'No Disponibles', value: stats.agotados },
                        { label: 'Frutas', value: stats.fruta },
                        { label: 'Licores', value: stats.licor },
                        { label: 'Complementos', value: stats.complemento },
                    ].map(s => (
                        <div
                            key={s.label}
                            className="glass-card"
                            style={{ padding: '20px 24px' }}
                        >
                            <p
                                className="label-caps"
                                style={{ fontSize: '0.6rem', marginBottom: '8px' }}
                            >
                                {s.label}
                            </p>
                            <p
                                style={{
                                    fontSize: '2rem',
                                    fontWeight: 900,
                                    color: 'var(--primary-green)',
                                    margin: 0,
                                }}
                            >
                                {s.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Filter tabs */}
                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '24px',
                        flexWrap: 'wrap',
                    }}
                >
                    {['todos', 'fruta', 'licor', 'complemento'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFiltro(f)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '24px',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                textTransform: 'capitalize',
                                background:
                                    filtro === f ? 'var(--primary-green)' : 'var(--surface-high)',
                                color: filtro === f ? 'black' : 'var(--text-secondary)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: '0.2s',
                            }}
                        >
                            {f === 'todos' ? 'Todos' : CATEGORIA_BADGE[f]?.label}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'var(--surface-low)', height: '50px' }}>
                            <tr>
                                <th
                                    style={{
                                        padding: '0 24px',
                                        fontSize: '0.65rem',
                                        color: 'var(--text-secondary)',
                                    }}
                                >
                                    INGREDIENTE
                                </th>
                                <th
                                    style={{
                                        padding: '0 24px',
                                        fontSize: '0.65rem',
                                        color: 'var(--text-secondary)',
                                    }}
                                >
                                    CATEGORÍA
                                </th>
                                <th
                                    style={{
                                        padding: '0 24px',
                                        fontSize: '0.65rem',
                                        color: 'var(--text-secondary)',
                                    }}
                                >
                                    PRECIO ADICIONAL
                                </th>
                                <th
                                    style={{
                                        padding: '0 24px',
                                        fontSize: '0.65rem',
                                        color: 'var(--text-secondary)',
                                    }}
                                >
                                    ESTADO
                                </th>
                                <th
                                    style={{
                                        padding: '0 24px',
                                        textAlign: 'right',
                                        fontSize: '0.65rem',
                                        color: 'var(--text-secondary)',
                                    }}
                                >
                                    ACCIONES
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.map(ing => {
                                const badge = CATEGORIA_BADGE[ing.categoria] || {};
                                return (
                                    <tr
                                        key={ing.id}
                                        style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                                            height: '68px',
                                            opacity: ing.disponible ? 1 : 0.55,
                                            transition: 'opacity 0.2s',
                                        }}
                                    >
                                        <td style={{ padding: '0 24px' }}>
                                            <p
                                                style={{
                                                    fontWeight: 700,
                                                    fontSize: '0.9rem',
                                                    margin: 0,
                                                }}
                                            >
                                                {ing.nombre}
                                            </p>
                                        </td>
                                        <td style={{ padding: '0 24px' }}>
                                            <span
                                                style={{
                                                    background: badge.bg,
                                                    color: badge.color,
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.72rem',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td
                                            style={{
                                                padding: '0 24px',
                                                fontWeight: 700,
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            {parseFloat(ing.precio_adicional) > 0
                                                ? fmt(ing.precio_adicional)
                                                : '—'}
                                        </td>
                                        <td style={{ padding: '0 24px' }}>
                                            <button
                                                onClick={() => handleToggleDisponible(ing)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '6px 0',
                                                }}
                                            >
                                                <span
                                                    className="material-icons-round"
                                                    style={{
                                                        fontSize: '20px',
                                                        color: ing.disponible
                                                            ? 'var(--primary-green)'
                                                            : 'var(--text-secondary)',
                                                    }}
                                                >
                                                    {ing.disponible
                                                        ? 'toggle_on'
                                                        : 'toggle_off'}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: '0.78rem',
                                                        fontWeight: 700,
                                                        color: ing.disponible
                                                            ? 'var(--primary-green)'
                                                            : 'var(--text-secondary)',
                                                    }}
                                                >
                                                    {ing.disponible ? 'Activo' : 'Agotado'}
                                                </span>
                                            </button>
                                        </td>
                                        <td style={{ padding: '0 24px', textAlign: 'right' }}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    gap: '8px',
                                                    justifyContent: 'flex-end',
                                                }}
                                            >
                                                <button
                                                    onClick={() => openEdit(ing)}
                                                    title="Editar"
                                                    style={{
                                                        background: 'var(--surface-high)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        padding: '8px',
                                                        cursor: 'pointer',
                                                        color: 'var(--text-secondary)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete(ing)}
                                                    title="Eliminar"
                                                    style={{
                                                        background: 'rgba(255,60,60,0.1)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        padding: '8px',
                                                        cursor: 'pointer',
                                                        color: '#ff4444',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtrados.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        style={{
                                            padding: '48px 24px',
                                            textAlign: 'center',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        No hay ingredientes en esta categoría.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create / Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowModal(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.85)',
                            zIndex: 1000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px',
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.93, y: 16, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.93, y: 16, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            onClick={e => e.stopPropagation()}
                            className="glass-card"
                            style={{
                                maxWidth: '480px',
                                width: '100%',
                                padding: '32px',
                                background: 'var(--surface-dim)',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '28px',
                                }}
                            >
                                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                                    {editMode ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        background: 'var(--surface-high)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        cursor: 'pointer',
                                        color: 'var(--text-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <span className="material-icons-round" style={{ fontSize: '18px' }}>
                                        close
                                    </span>
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label
                                        className="label-caps"
                                        style={{ fontSize: '0.65rem', display: 'block', marginBottom: '8px' }}
                                    >
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        className="premium-input"
                                        value={formData.nombre}
                                        onChange={e =>
                                            setFormData(p => ({ ...p, nombre: e.target.value }))
                                        }
                                        placeholder="Ej: Mora Azul"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label
                                        className="label-caps"
                                        style={{ fontSize: '0.65rem', display: 'block', marginBottom: '8px' }}
                                    >
                                        Categoría
                                    </label>
                                    <select
                                        className="premium-input"
                                        value={formData.categoria}
                                        onChange={e =>
                                            setFormData(p => ({ ...p, categoria: e.target.value }))
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {CATEGORIAS.map(c => (
                                            <option key={c.value} value={c.value}>
                                                {c.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label
                                        className="label-caps"
                                        style={{ fontSize: '0.65rem', display: 'block', marginBottom: '8px' }}
                                    >
                                        Precio Adicional (COP)
                                    </label>
                                    <input
                                        type="number"
                                        className="premium-input"
                                        value={formData.precio_adicional}
                                        onChange={e =>
                                            setFormData(p => ({ ...p, precio_adicional: e.target.value }))
                                        }
                                        min="0"
                                        step="500"
                                        placeholder="0"
                                    />
                                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '6px 0 0' }}>
                                        Precio base del granizado: $12.000. Este valor se suma al total.
                                    </p>
                                </div>

                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.disponible}
                                        onChange={e =>
                                            setFormData(p => ({ ...p, disponible: e.target.checked }))
                                        }
                                        style={{
                                            width: '18px',
                                            height: '18px',
                                            accentColor: 'var(--primary-green)',
                                        }}
                                    />
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                        Disponible para pedidos
                                    </span>
                                </label>
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '12px',
                                    marginTop: '28px',
                                }}
                            >
                                <button
                                    className="btn-secondary"
                                    onClick={() => setShowModal(false)}
                                    disabled={guardando}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn-primary"
                                    onClick={handleSave}
                                    disabled={guardando || !formData.nombre.trim()}
                                    style={{ opacity: !formData.nombre.trim() ? 0.5 : 1 }}
                                >
                                    {guardando ? 'Guardando...' : editMode ? 'Guardar' : 'Crear'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirm Delete Modal */}
            <AnimatePresence>
                {confirmDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setConfirmDelete(null)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.85)',
                            zIndex: 1100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px',
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.93, y: 16, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.93, y: 16, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            onClick={e => e.stopPropagation()}
                            className="glass-card"
                            style={{
                                maxWidth: '380px',
                                width: '100%',
                                padding: '32px',
                                textAlign: 'center',
                                background: 'var(--surface-dim)',
                            }}
                        >
                            <span
                                className="material-icons-round"
                                style={{ fontSize: '48px', color: '#ff4444', marginBottom: '16px', display: 'block' }}
                            >
                                delete_forever
                            </span>
                            <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>
                                ¿Eliminar ingrediente?
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                                Se eliminará <strong>{confirmDelete.nombre}</strong> permanentemente.
                                Esta acción no se puede deshacer.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <button
                                    className="btn-secondary"
                                    onClick={() => setConfirmDelete(null)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn-primary"
                                    onClick={() => handleDelete(confirmDelete.id)}
                                    style={{
                                        background: '#ff4444',
                                        borderColor: '#ff4444',
                                    }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Nav */}
            <nav className="bottom-nav">
                <Link to="/" className="nav-item">
                    <span className="material-icons-round">home</span>
                    <span>Inicio</span>
                </Link>
                <Link to="/admin/pedidos" className="nav-item">
                    <span className="material-icons-round">shopping_bag</span>
                    <span>Ventas</span>
                </Link>
                <Link to="/admin/inventario" className="nav-item">
                    <span className="material-icons-round">inventory_2</span>
                    <span>Inventario</span>
                </Link>
                <Link to="/admin/granizados" className="nav-item active">
                    <span className="material-icons-round">local_drink</span>
                    <span>Granizados</span>
                </Link>
            </nav>
        </>
    );
};

export default GranizadosAdminPage;
