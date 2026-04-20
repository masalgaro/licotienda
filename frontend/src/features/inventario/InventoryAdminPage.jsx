import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, ToggleLeft, ToggleRight, Edit2, Trash2 } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';
const VISTA_TODOS = 'todos';
const VISTA_OFERTAS = 'ofertas';
const EMPTY_PRODUCT = {
    nombre: '',
    precio: '',
    existencias: 1,
    imagen: null,
    categoria: '',
    esta_activo: true,
    en_oferta: false,
    descuento_porcentaje: 0
};
const EMPTY_OFFER = {
    id: null,
    nombre: '',
    precio: 0,
    en_oferta: false,
    descuento_porcentaje: 0
};

const formatCurrency = (value) => new Intl.NumberFormat('es-CO').format(Number(value || 0));
const calculateOfferPrice = (precio, descuentoPorcentaje) => {
    const precioBase = Number(precio || 0);
    const descuento = Number(descuentoPorcentaje || 0);
    return precioBase - (precioBase * descuento / 100);
};

const buildProductsUrl = (vistaProductos) => {
    const params = new URLSearchParams();
    if (vistaProductos === VISTA_OFERTAS) {
        params.set('en_oferta', 'true');
    }

    const query = params.toString();
    return `${API_BASE_URL}/api/v1/inventario/productos/${query ? `?${query}` : ''}`;
};

const InventoryAdminPage = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [vistaProductos, setVistaProductos] = useState(VISTA_TODOS);

    const [showModal, setShowModal] = useState(false);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [showCatModal, setShowCatModal] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [editingCatId, setEditingCatId] = useState(null);
    const [editCatName, setEditCatName] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [guardandoOferta, setGuardandoOferta] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(EMPTY_PRODUCT);
    const [offerDraft, setOfferDraft] = useState(EMPTY_OFFER);

    const fetchData = async (vistaActual = vistaProductos) => {
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get(buildProductsUrl(vistaActual)),
                axios.get(`${API_BASE_URL}/api/v1/inventario/categorias/`)
            ]);
            setProductos(prodRes.data);
            setCategorias(catRes.data);
        } catch (_err) {
            console.error("Error admin fetching:", _err);
        }
    };

    useEffect(() => {
        const fetchInitialViewData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    axios.get(buildProductsUrl(vistaProductos)),
                    axios.get(`${API_BASE_URL}/api/v1/inventario/categorias/`)
                ]);
                setProductos(prodRes.data);
                setCategorias(catRes.data);
            } catch (_err) {
                console.error("Error admin fetching:", _err);
            }
        };

        fetchInitialViewData();
    }, [vistaProductos]);

    const stats = {
        total: productos.length,
        categorias: categorias.length,
        activos: productos.filter((p) => p.esta_activo).length,
        ofertas: productos.filter((p) => p.en_oferta).length
    };

    const resetProductModal = () => {
        setCurrentProduct(EMPTY_PRODUCT);
        setSelectedFile(null);
        setEditMode(false);
        setShowModal(false);
    };

    const resetOfferModal = () => {
        setOfferDraft(EMPTY_OFFER);
        setShowOfferModal(false);
        setGuardandoOferta(false);
    };

    const handleToggleActive = async (id, status) => {
        try {
            await axios.put(`${API_BASE_URL}/api/v1/inventario/productos/${id}/`, {
                esta_activo: !status
            });
            await fetchData(vistaProductos);
        } catch {
            alert("Error al cambiar estado");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/v1/inventario/productos/${id}/`);
            await fetchData(vistaProductos);
        } catch (_err) {
            alert(_err.response?.data?.detail || "Error al eliminar");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nombre', currentProduct.nombre);
        formData.append('precio', parseFloat(currentProduct.precio));
        formData.append('existencias', parseInt(currentProduct.existencias, 10));
        formData.append('esta_activo', currentProduct.esta_activo);
        formData.append('en_oferta', currentProduct.en_oferta);
        formData.append(
            'descuento_porcentaje',
            currentProduct.en_oferta ? parseInt(currentProduct.descuento_porcentaje, 10) || 0 : 0
        );

        if (currentProduct.categoria) {
            formData.append('categoria', currentProduct.categoria);
        }

        if (selectedFile) {
            formData.append('imagen', selectedFile);
        }

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (editMode) {
                await axios.put(
                    `${API_BASE_URL}/api/v1/inventario/productos/${currentProduct.id}/`,
                    formData,
                    config
                );
            } else {
                await axios.post(`${API_BASE_URL}/api/v1/inventario/productos/`, formData, config);
            }

            resetProductModal();
            await fetchData(vistaProductos);
        } catch (_err) {
            console.error("Save error:", _err.response?.data);
            alert(
                "Error al guardar producto: " +
                    JSON.stringify(_err.response?.data || "Error desconocido")
            );
        }
    };

    const handleNewProduct = () => {
        setCurrentProduct(EMPTY_PRODUCT);
        setSelectedFile(null);
        setEditMode(false);
        setShowModal(true);
    };

    const handleNewCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/api/v1/inventario/categorias/`, { nombre: newCatName });
            setNewCatName('');
            await fetchData(vistaProductos);
        } catch (_err) {
            alert("Error al crear categoría: " + JSON.stringify(_err.response?.data || "Error"));
        }
    };

    const handleEditCategory = async (cat) => {
        if (editingCatId === cat.id) {
            try {
                await axios.put(`${API_BASE_URL}/api/v1/inventario/categorias/${cat.id}/`, {
                    nombre: editCatName
                });
                setEditingCatId(null);
                await fetchData(vistaProductos);
            } catch (_err) {
                alert("Error al editar: " + JSON.stringify(_err.response?.data || "Error."));
            }
        } else {
            setEditingCatId(cat.id);
            setEditCatName(cat.nombre);
        }
    };

    const handleDeleteCategory = async (id) => {
        const confirmText = window.prompt(
            "¿Eliminar esta categoría? Esto fallará si tiene productos.\nEscribe 'ELIMINAR' para confirmar:"
        );
        if (confirmText !== 'ELIMINAR') {
            alert("Eliminación cancelada.");
            return;
        }
        try {
            await axios.delete(`${API_BASE_URL}/api/v1/inventario/categorias/${id}/`);
            await fetchData(vistaProductos);
        } catch (_e) {
            alert(_e.response?.data?.error || JSON.stringify(_e.response?.data || "Error al eliminar."));
        }
    };

    const handleEditProduct = (producto) => {
        setCurrentProduct({
            ...producto,
            categoria: producto.categoria || ''
        });
        setSelectedFile(null);
        setEditMode(true);
        setShowModal(true);
    };

    const handleEditOffer = (producto) => {
        setOfferDraft({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            en_oferta: Boolean(producto.en_oferta),
            descuento_porcentaje: producto.descuento_porcentaje || 0
        });
        setShowOfferModal(true);
    };

    const handleSaveOffer = async () => {
        const descuentoNormalizado = offerDraft.en_oferta
            ? parseInt(offerDraft.descuento_porcentaje, 10) || 0
            : 0;

        setGuardandoOferta(true);
        try {
            await axios.put(`${API_BASE_URL}/api/v1/inventario/productos/${offerDraft.id}/`, {
                en_oferta: offerDraft.en_oferta,
                descuento_porcentaje: descuentoNormalizado
            });
            await fetchData(vistaProductos);
            resetOfferModal();
        } catch (_err) {
            alert(
                _err.response?.data?.descuento_porcentaje?.[0] ||
                    _err.response?.data?.non_field_errors?.[0] ||
                    "Error al guardar la oferta."
            );
            setGuardandoOferta(false);
        }
    };

    const handleRemoveOffer = async () => {
        setGuardandoOferta(true);
        try {
            await axios.put(`${API_BASE_URL}/api/v1/inventario/productos/${offerDraft.id}/`, {
                en_oferta: false,
                descuento_porcentaje: 0
            });
            await fetchData(vistaProductos);
            resetOfferModal();
        } catch {
            alert("Error al quitar la oferta.");
            setGuardandoOferta(false);
        }
    };

    const descuentoOferta = parseInt(offerDraft.descuento_porcentaje, 10);
    const descuentoValido =
        !offerDraft.en_oferta || (!Number.isNaN(descuentoOferta) && descuentoOferta >= 1 && descuentoOferta <= 100);
    const precioOferta = calculateOfferPrice(offerDraft.precio, offerDraft.descuento_porcentaje);

    return (
        <>
            <div className="app-container animate-fade">
                <header
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 'var(--spacing-xxl)',
                        gap: '16px',
                        flexWrap: 'wrap'
                    }}
                >
                    <div>
                        <span className="label-caps" style={{ color: 'var(--primary-green)' }}>
                            Módulo Administrativo
                        </span>
                        <h1 style={{ margin: '8px 0 0 0' }}>Cava de Inventario</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            className="btn-primary"
                            style={{
                                width: 'auto',
                                padding: '12px 24px',
                                background: 'var(--surface-high)',
                                color: 'var(--primary-green)',
                                border: '1px solid var(--primary-green)',
                                boxShadow: '0 0 15px rgba(0,255,140,0.1)',
                                display: 'flex',
                                gap: '8px'
                            }}
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

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: 'var(--spacing-lg)',
                        marginBottom: 'var(--spacing-xl)'
                    }}
                >
                    <div className="glass-card">
                        <span className="label-caps">Mostrando</span>
                        <div
                            style={{
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: 'var(--primary-green)',
                                marginTop: '8px'
                            }}
                        >
                            {stats.total}
                        </div>
                    </div>
                    <div className="glass-card">
                        <span className="label-caps">Categorías</span>
                        <div
                            style={{
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: 'var(--primary-green)',
                                marginTop: '8px'
                            }}
                        >
                            {stats.categorias}
                        </div>
                    </div>
                    <div className="glass-card">
                        <span className="label-caps">Activos</span>
                        <div
                            style={{
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: 'var(--primary-green)',
                                marginTop: '8px'
                            }}
                        >
                            {stats.activos}
                        </div>
                    </div>
                    <div className="glass-card">
                        <span className="label-caps">Ofertas visibles</span>
                        <div
                            style={{
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: 'var(--primary-green)',
                                marginTop: '8px'
                            }}
                        >
                            {stats.ofertas}
                        </div>
                    </div>
                </div>

                <div
                    className="hide-scrollbar"
                    style={{
                        display: 'flex',
                        gap: '12px',
                        overflowX: 'auto',
                        marginBottom: '24px',
                        paddingBottom: '4px'
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setVistaProductos(VISTA_TODOS)}
                        style={{
                            padding: '10px 18px',
                            borderRadius: '999px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            background:
                                vistaProductos === VISTA_TODOS
                                    ? 'var(--primary-green)'
                                    : 'var(--surface-low)',
                            color: vistaProductos === VISTA_TODOS ? '#000' : 'var(--text-primary)',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        Todos
                    </button>
                    <button
                        type="button"
                        onClick={() => setVistaProductos(VISTA_OFERTAS)}
                        style={{
                            padding: '10px 18px',
                            borderRadius: '999px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            background:
                                vistaProductos === VISTA_OFERTAS
                                    ? 'var(--primary-green)'
                                    : 'var(--surface-low)',
                            color: vistaProductos === VISTA_OFERTAS ? '#000' : 'var(--text-primary)',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        Solo ofertas
                    </button>
                </div>

                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="admin-table-container">
                        <table style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr
                                    style={{
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        background: 'rgba(255,255,255,0.02)'
                                    }}
                                >
                                    <th style={{ padding: '20px', color: 'var(--text-secondary)' }} className="label-caps">
                                        Producto
                                    </th>
                                    <th style={{ padding: '20px', color: 'var(--text-secondary)' }} className="label-caps">
                                        Precio
                                    </th>
                                    <th style={{ padding: '20px', color: 'var(--text-secondary)' }} className="label-caps">
                                        Stock
                                    </th>
                                    <th style={{ padding: '20px', color: 'var(--text-secondary)' }} className="label-caps">
                                        Estado
                                    </th>
                                    <th
                                        style={{ padding: '20px', color: 'var(--text-secondary)', textAlign: 'right' }}
                                        className="label-caps"
                                    >
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((producto) => {
                                    const precioFinal = calculateOfferPrice(
                                        producto.precio,
                                        producto.descuento_porcentaje
                                    );

                                    return (
                                        <motion.tr
                                            key={producto.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.03 }}
                                            style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                                        >
                                            <td style={{ padding: '16px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '8px',
                                                            background: 'var(--surface-high)',
                                                            overflow: 'hidden'
                                                        }}
                                                    >
                                                        <img
                                                            src={
                                                                producto.imagen
                                                                    ? producto.imagen.startsWith('http')
                                                                        ? producto.imagen
                                                                        : `${API_BASE_URL}${producto.imagen}`
                                                                    : producto.imagen_url || '/placeholder.png'
                                                            }
                                                            alt={producto.nombre}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover'
                                                            }}
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder.png';
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600' }}>{producto.nombre}</div>
                                                        <div
                                                            style={{
                                                                fontSize: '0.75rem',
                                                                color: 'var(--text-secondary)'
                                                            }}
                                                        >
                                                            {categorias.find((categoria) => categoria.id === producto.categoria)
                                                                ?.nombre || 'Sin categoría'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 20px', fontWeight: '600' }}>
                                                {producto.en_oferta ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <span
                                                            style={{
                                                                fontSize: '0.75rem',
                                                                color: 'var(--text-secondary)',
                                                                textDecoration: 'line-through'
                                                            }}
                                                        >
                                                            Base: ${formatCurrency(producto.precio)}
                                                        </span>
                                                        <span
                                                            style={{
                                                                color: 'var(--primary-green)',
                                                                fontWeight: 800
                                                            }}
                                                        >
                                                            Oferta: ${formatCurrency(precioFinal)}
                                                        </span>
                                                        <span
                                                            style={{
                                                                color: 'var(--primary-green)',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            ↓ {producto.descuento_porcentaje}% OFF
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span>${formatCurrency(producto.precio)}</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontWeight: '500' }}>{producto.existencias} und</span>
                                                    {producto.existencias <= 5 && producto.existencias > 0 && (
                                                        <span
                                                            style={{
                                                                background: 'rgba(255, 60, 60, 0.1)',
                                                                color: 'var(--error)',
                                                                fontSize: '0.65rem',
                                                                padding: '4px 8px',
                                                                borderRadius: '12px',
                                                                fontWeight: '800',
                                                                textTransform: 'uppercase'
                                                            }}
                                                        >
                                                            ¡Stock Bajo!
                                                        </span>
                                                    )}
                                                    {producto.existencias === 0 && (
                                                        <span
                                                            style={{
                                                                background: 'rgba(255, 60, 60, 0.1)',
                                                                color: 'var(--error)',
                                                                fontSize: '0.65rem',
                                                                padding: '4px 8px',
                                                                borderRadius: '12px',
                                                                fontWeight: '800',
                                                                textTransform: 'uppercase'
                                                            }}
                                                        >
                                                            Agotado
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 20px' }}>
                                                <button
                                                    onClick={() =>
                                                        handleToggleActive(producto.id, producto.esta_activo)
                                                    }
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        color: producto.esta_activo
                                                            ? 'var(--primary-green)'
                                                            : 'var(--text-secondary)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    {producto.esta_activo ? (
                                                        <ToggleRight size={24} />
                                                    ) : (
                                                        <ToggleLeft size={24} />
                                                    )}
                                                    {producto.esta_activo ? 'Activo' : 'Pausado'}
                                                </button>
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        gap: '8px',
                                                        flexWrap: 'wrap'
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditOffer(producto)}
                                                        style={{
                                                            background: producto.en_oferta
                                                                ? 'rgba(57, 181, 74, 0.15)'
                                                                : 'rgba(255,255,255,0.05)',
                                                            border: 'none',
                                                            padding: '8px 12px',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            color: producto.en_oferta
                                                                ? 'var(--primary-green)'
                                                                : 'var(--text-primary)',
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        Oferta
                                                    </button>
                                                    <button
                                                        className="btn-icon"
                                                        style={{
                                                            background: 'rgba(255,255,255,0.05)',
                                                            border: 'none',
                                                            padding: '8px',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            color: 'var(--text-primary)'
                                                        }}
                                                        onClick={() => handleEditProduct(producto)}
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        className="btn-icon"
                                                        style={{
                                                            background: 'rgba(213, 61, 24, 0.1)',
                                                            border: 'none',
                                                            padding: '8px',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            color: 'var(--error)'
                                                        }}
                                                        onClick={() => handleDelete(producto.id)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {productos.length === 0 && (
                        <div style={{ padding: '28px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            {vistaProductos === VISTA_OFERTAS
                                ? 'No hay productos con oferta activa en este momento.'
                                : 'No hay productos registrados en inventario.'}
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="glass-card"
                            style={{
                                width: '100%',
                                maxWidth: '500px',
                                padding: 'var(--spacing-xl)',
                                maxHeight: '90vh',
                                overflowY: 'auto'
                            }}
                        >
                            <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>
                                {editMode ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>
                            <form onSubmit={handleSave}>
                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <label className="label-caps">Nombre del Producto</label>
                                    <input
                                        type="text"
                                        className="premium-input"
                                        required
                                        value={currentProduct.nombre}
                                        onChange={(e) =>
                                            setCurrentProduct({
                                                ...currentProduct,
                                                nombre: e.target.value
                                            })
                                        }
                                    />
                                </div>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: 'var(--spacing-md)',
                                        marginBottom: 'var(--spacing-md)'
                                    }}
                                >
                                    <div>
                                        <label className="label-caps">Precio ($)</label>
                                        <input
                                            type="number"
                                            className="premium-input"
                                            required
                                            value={currentProduct.precio}
                                            onChange={(e) =>
                                                setCurrentProduct({
                                                    ...currentProduct,
                                                    precio: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="label-caps">Existencias (und)</label>
                                        <input
                                            type="number"
                                            className="premium-input"
                                            required
                                            value={currentProduct.existencias}
                                            onChange={(e) =>
                                                setCurrentProduct({
                                                    ...currentProduct,
                                                    existencias: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: 'var(--spacing-md)',
                                        marginBottom: 'var(--spacing-md)',
                                        background: 'rgba(0, 255, 140, 0.05)',
                                        padding: '12px',
                                        borderRadius: '12px'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <label className="label-caps" style={{ color: 'var(--primary-green)' }}>
                                            Habilitar Oferta
                                        </label>
                                        <label
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer',
                                                marginTop: '8px'
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={currentProduct.en_oferta}
                                                onChange={(e) =>
                                                    setCurrentProduct({
                                                        ...currentProduct,
                                                        en_oferta: e.target.checked,
                                                        descuento_porcentaje: e.target.checked
                                                            ? currentProduct.descuento_porcentaje
                                                            : 0
                                                    })
                                                }
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    accentColor: 'var(--primary-green)'
                                                }}
                                            />
                                            <span>Activar Descuento</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label
                                            className="label-caps"
                                            style={{ opacity: currentProduct.en_oferta ? 1 : 0.4 }}
                                        >
                                            % Descuento
                                        </label>
                                        <input
                                            type="number"
                                            className="premium-input"
                                            disabled={!currentProduct.en_oferta}
                                            value={currentProduct.descuento_porcentaje}
                                            onChange={(e) =>
                                                setCurrentProduct({
                                                    ...currentProduct,
                                                    descuento_porcentaje: e.target.value
                                                })
                                            }
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </div>
                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <label className="label-caps">Cargar Imagen</label>
                                    <input
                                        type="file"
                                        className="premium-input"
                                        accept="image/*"
                                        required={!editMode}
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                        style={{ padding: '10px' }}
                                    />
                                    {editMode && currentProduct.imagen && !selectedFile && (
                                        <div
                                            style={{
                                                fontSize: '0.7rem',
                                                color: 'var(--text-secondary)',
                                                marginTop: '4px'
                                            }}
                                        >
                                            Imagen actual: {currentProduct.imagen.split('/').pop()}
                                        </div>
                                    )}
                                </div>
                                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                    <label className="label-caps">Categoría</label>
                                    <select
                                        className="premium-input"
                                        required
                                        value={currentProduct.categoria || ''}
                                        onChange={(e) =>
                                            setCurrentProduct({
                                                ...currentProduct,
                                                categoria: e.target.value
                                            })
                                        }
                                        style={{ appearance: 'none' }}
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {categorias.map((categoria) => (
                                            <option key={categoria.id} value={categoria.id}>
                                                {categoria.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                    <button
                                        type="button"
                                        className="btn-primary"
                                        style={{
                                            background: 'var(--surface-high)',
                                            color: 'var(--text-primary)',
                                            boxShadow: 'none'
                                        }}
                                        onClick={resetProductModal}
                                    >
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
                {showOfferModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 10000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="glass-card"
                            style={{ width: '100%', maxWidth: '460px', padding: '28px' }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: '16px',
                                    marginBottom: '24px'
                                }}
                            >
                                <div>
                                    <p
                                        className="label-caps"
                                        style={{ color: 'var(--primary-green)', marginBottom: '8px' }}
                                    >
                                        Gestión rápida de oferta
                                    </p>
                                    <h2 style={{ margin: 0 }}>Editar Oferta</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={resetOfferModal}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span className="material-icons-round">close</span>
                                </button>
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gap: '16px',
                                    marginBottom: '24px'
                                }}
                            >
                                <div className="glass-card" style={{ padding: '16px' }}>
                                    <div className="label-caps" style={{ marginBottom: '8px' }}>
                                        Producto
                                    </div>
                                    <div style={{ fontWeight: 700, marginBottom: '8px' }}>
                                        {offerDraft.nombre}
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        Precio base: ${formatCurrency(offerDraft.precio)}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '16px',
                                        alignItems: 'end'
                                    }}
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px'
                                        }}
                                    >
                                        <span className="label-caps">Oferta activa</span>
                                        <input
                                            type="checkbox"
                                            checked={offerDraft.en_oferta}
                                            onChange={(e) =>
                                                setOfferDraft((prev) => ({
                                                    ...prev,
                                                    en_oferta: e.target.checked,
                                                    descuento_porcentaje: e.target.checked
                                                        ? prev.descuento_porcentaje || 10
                                                        : 0
                                                }))
                                            }
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                accentColor: 'var(--primary-green)'
                                            }}
                                        />
                                    </label>

                                    <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <span
                                            className="label-caps"
                                            style={{ opacity: offerDraft.en_oferta ? 1 : 0.4 }}
                                        >
                                            % Descuento
                                        </span>
                                        <input
                                            type="number"
                                            className="premium-input"
                                            disabled={!offerDraft.en_oferta}
                                            min="1"
                                            max="100"
                                            value={offerDraft.descuento_porcentaje}
                                            onChange={(e) =>
                                                setOfferDraft((prev) => ({
                                                    ...prev,
                                                    descuento_porcentaje: e.target.value
                                                }))
                                            }
                                        />
                                    </label>
                                </div>

                                <div
                                    className="glass-card"
                                    style={{
                                        padding: '16px',
                                        background: 'rgba(57, 181, 74, 0.06)',
                                        border: '1px solid rgba(57, 181, 74, 0.18)'
                                    }}
                                >
                                    <div className="label-caps" style={{ marginBottom: '8px' }}>
                                        Vista previa
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}
                                    >
                                        <span style={{ color: 'var(--text-secondary)' }}>Precio final</span>
                                        <span
                                            style={{
                                                fontWeight: 900,
                                                fontSize: '1.3rem',
                                                color: 'var(--primary-green)'
                                            }}
                                        >
                                            $
                                            {formatCurrency(
                                                offerDraft.en_oferta ? precioOferta : offerDraft.precio
                                            )}
                                        </span>
                                    </div>
                                    {offerDraft.en_oferta && !descuentoValido && (
                                        <p style={{ color: 'var(--error)', marginTop: '12px', marginBottom: 0 }}>
                                            Ingresa un descuento entre 1% y 100%.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={handleSaveOffer}
                                    disabled={guardandoOferta || !descuentoValido}
                                    style={{
                                        border: 'none',
                                        cursor: guardandoOferta ? 'not-allowed' : 'pointer',
                                        opacity: guardandoOferta ? 0.7 : 1
                                    }}
                                >
                                    {guardandoOferta ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={handleRemoveOffer}
                                    disabled={guardandoOferta}
                                    style={{
                                        background: 'rgba(213, 61, 24, 0.12)',
                                        color: 'var(--error)',
                                        boxShadow: 'none',
                                        border: '1px solid rgba(213, 61, 24, 0.25)',
                                        cursor: guardandoOferta ? 'not-allowed' : 'pointer',
                                        opacity: guardandoOferta ? 0.7 : 1
                                    }}
                                >
                                    Quitar oferta
                                </button>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={resetOfferModal}
                                    style={{
                                        background: 'var(--surface-high)',
                                        color: 'var(--text-primary)',
                                        boxShadow: 'none'
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCatModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="glass-card"
                            style={{ width: '100%', maxWidth: '400px', padding: 'var(--spacing-xl)' }}
                        >
                            <header
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 'var(--spacing-lg)'
                                }}
                            >
                                <h2 style={{ margin: 0 }}>Gestionar Categorías</h2>
                                <button
                                    type="button"
                                    onClick={() => setShowCatModal(false)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span className="material-icons-round">close</span>
                                </button>
                            </header>

                            <div
                                className="hide-scrollbar"
                                style={{
                                    maxHeight: '250px',
                                    overflowY: 'auto',
                                    marginBottom: '20px',
                                    border: '1px solid var(--glass-border)',
                                    padding: '8px',
                                    borderRadius: '12px'
                                }}
                            >
                                {categorias.map((categoria) => (
                                    <div
                                        key={categoria.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '12px',
                                            background: 'var(--surface-low)',
                                            marginBottom: '8px',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        {editingCatId === categoria.id ? (
                                            <input
                                                autoFocus
                                                type="text"
                                                className="premium-input"
                                                value={editCatName}
                                                onChange={(e) => setEditCatName(e.target.value)}
                                                style={{ padding: '8px', flex: 1, marginRight: '12px' }}
                                            />
                                        ) : (
                                            <span style={{ fontWeight: 600 }}>{categoria.nombre}</span>
                                        )}
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                type="button"
                                                onClick={() => handleEditCategory(categoria)}
                                                className="btn-icon"
                                                style={{
                                                    background:
                                                        editingCatId === categoria.id
                                                            ? 'var(--primary-green)'
                                                            : 'rgba(255,255,255,0.05)',
                                                    color: editingCatId === categoria.id ? 'black' : 'white',
                                                    border: 'none',
                                                    padding: '6px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {editingCatId === categoria.id ? (
                                                    <span className="material-icons-round" style={{ fontSize: '16px' }}>
                                                        check
                                                    </span>
                                                ) : (
                                                    <Edit2 size={16} />
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteCategory(categoria.id)}
                                                className="btn-icon"
                                                style={{
                                                    background: 'rgba(213, 61, 24, 0.1)',
                                                    color: 'var(--error)',
                                                    border: 'none',
                                                    padding: '6px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {categorias.length === 0 && (
                                    <p
                                        style={{
                                            textAlign: 'center',
                                            margin: '20px 0',
                                            color: 'var(--text-secondary)'
                                        }}
                                    >
                                        No hay categorías registradas.
                                    </p>
                                )}
                            </div>

                            <form onSubmit={handleNewCategory}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        className="premium-input"
                                        required
                                        value={newCatName}
                                        onChange={(e) => setNewCatName(e.target.value)}
                                        placeholder="Nueva categoría..."
                                        style={{ flex: 1 }}
                                    />
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        style={{ width: 'auto', padding: '0 20px' }}
                                    >
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
