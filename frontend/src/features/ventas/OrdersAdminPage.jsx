import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const fmt = n => new Intl.NumberFormat('es-CO').format(n);

const STATUS_LABEL = {
    PAGO_VERIFICADO: 'Verificado',
    PAGO_SUBIDO: 'Pago Subido',
    PAGO_RECHAZADO: 'Rechazado',
    PENDIENTE_PAGO: 'Pendiente',
    PREPARANDO: 'Preparando',
    DESPACHADO: 'Despachado',
};

const getStatusColor = status => {
    switch (status) {
        case 'PAGO_VERIFICADO': return 'var(--primary-green)';
        case 'PAGO_SUBIDO': return '#fdbd2d';
        case 'PAGO_RECHAZADO': return 'var(--error)';
        case 'PENDIENTE_PAGO': return 'var(--text-secondary)';
        default: return 'var(--text-primary)';
    }
};

const StatusBadge = ({ status }) => (
    <span style={{
        fontSize: '0.7rem', fontWeight: 800,
        color: getStatusColor(status),
        background: `${getStatusColor(status)}20`,
        padding: '4px 10px', borderRadius: '6px',
    }}>
        {STATUS_LABEL[status] || status}
    </span>
);

const SectionLabel = ({ children }) => (
    <p className="label-caps" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '12px', marginTop: 0 }}>
        {children}
    </p>
);

const Divider = () => <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '24px 0' }} />;

const OrderDetailModal = ({ pedido, motivoRechazo, setMotivoRechazo, onClose, onAction }) => {
    const items = pedido.items || [];
    const subtotal = items.reduce((s, i) => s + parseFloat(i.precio) * i.cantidad, 0);
    const envio = parseFloat(pedido.costo_envio || 0);
    const total = subtotal + envio;
    const esTransferencia = pedido.metodo_pago === 'TRANSFERENCIA';
    const puedeGestionar = pedido.estado === 'PAGO_SUBIDO';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
                zIndex: 1000, display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: '20px',
            }}
        >
            <motion.div
                initial={{ scale: 0.93, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.93, opacity: 0, y: 16 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                onClick={e => e.stopPropagation()}
                className="glass-card"
                style={{
                    maxWidth: '560px', width: '100%', maxHeight: '90vh',
                    overflow: 'hidden', background: 'var(--surface-dim)',
                    display: 'flex', flexDirection: 'column', borderRadius: '20px',
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px 24px', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    gap: '12px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem' }}>Pedido #{pedido.id}</p>
                            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                                {pedido.cliente || 'Invitado'}
                            </p>
                        </div>
                        <StatusBadge status={pedido.estado} />
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'var(--surface-high)', border: 'none', color: 'var(--text-secondary)',
                            width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: '18px' }}>close</span>
                    </button>
                </div>

                {/* Scrollable body */}
                <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>

                    {/* Productos */}
                    <SectionLabel>Productos</SectionLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {items.map((item, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '10px 0',
                                    borderBottom: idx < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{
                                        background: 'var(--surface-high)', borderRadius: '8px',
                                        padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700,
                                        color: 'var(--text-secondary)', minWidth: '28px', textAlign: 'center',
                                    }}>
                                        x{item.cantidad}
                                    </span>
                                    <span style={{ fontSize: '0.87rem', fontWeight: 500 }}>
                                        {item.producto_nombre || `Producto #${item.producto}`}
                                    </span>
                                </div>
                                <span style={{ fontSize: '0.87rem', fontWeight: 700, color: 'var(--text-primary)', flexShrink: 0 }}>
                                    ${fmt(parseFloat(item.precio) * item.cantidad)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Totales */}
                    <div style={{ marginTop: '16px', background: 'var(--surface-high)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span>Subtotal</span>
                            <span>${fmt(subtotal)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span>Envío</span>
                            <span>{envio > 0 ? `$${fmt(envio)}` : 'Gratis'}</span>
                        </div>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem',
                            fontWeight: 800, color: 'var(--primary-green)',
                            borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '10px', marginTop: '4px',
                        }}>
                            <span>Total</span>
                            <span>${fmt(total)}</span>
                        </div>
                    </div>

                    <Divider />

                    {/* Dirección */}
                    <SectionLabel>Dirección de Entrega</SectionLabel>
                    <div style={{ background: 'var(--surface-high)', borderRadius: '12px', padding: '14px 16px' }}>
                        <p style={{ margin: 0, fontSize: '0.87rem', lineHeight: 1.5 }}>{pedido.direccion || '—'}</p>
                        {pedido.notas && (
                            <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                Nota: {pedido.notas}
                            </p>
                        )}
                    </div>

                    <Divider />

                    {/* Pago */}
                    <SectionLabel>Método de Pago</SectionLabel>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: esTransferencia ? '20px' : 0 }}>
                        <span className="material-icons-round" style={{ fontSize: '20px', color: 'var(--text-secondary)' }}>
                            {esTransferencia ? 'account_balance' : 'payments'}
                        </span>
                        <span style={{ fontSize: '0.87rem', fontWeight: 600 }}>
                            {esTransferencia ? 'Transferencia bancaria' : 'Efectivo contra entrega'}
                        </span>
                    </div>

                    {/* Comprobante solo si es transferencia */}
                    {esTransferencia && (
                        <>
                            <SectionLabel>Comprobante de Pago</SectionLabel>
                            {pedido.soporte_pago_url ? (
                                <div style={{
                                    background: 'black', borderRadius: '12px', overflow: 'hidden',
                                    minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <img
                                        src={`http://127.0.0.1:8000${pedido.soporte_pago_url}`}
                                        style={{ maxWidth: '100%', maxHeight: '460px', objectFit: 'contain' }}
                                        alt="Comprobante"
                                        onError={e => { e.target.src = 'https://placehold.co/400x600?text=Sin+imagen'; }}
                                    />
                                </div>
                            ) : (
                                <div style={{
                                    background: 'var(--surface-high)', borderRadius: '12px',
                                    padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem',
                                }}>
                                    <span className="material-icons-round" style={{ fontSize: '32px', opacity: 0.4, display: 'block', marginBottom: '8px' }}>image_not_supported</span>
                                    No se ha subido comprobante aún
                                </div>
                            )}
                        </>
                    )}

                    {/* Gestión de pago */}
                    {puedeGestionar && (
                        <>
                            <Divider />
                            <SectionLabel>Gestionar Pago</SectionLabel>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                Motivo de rechazo (si aplica)
                            </label>
                            <textarea
                                className="premium-input"
                                style={{ height: '72px', marginTop: '8px' }}
                                value={motivoRechazo}
                                onChange={e => setMotivoRechazo(e.target.value)}
                                placeholder="Ej: Saldo insuficiente o datos ilegibles"
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                                <button
                                    className="btn-secondary"
                                    style={{ color: 'var(--error)' }}
                                    onClick={() => onAction(pedido.id, 'rechazar')}
                                >
                                    Rechazar Pago
                                </button>
                                <button className="btn-primary" onClick={() => onAction(pedido.id, 'aprobar')}>
                                    Aprobar Pago
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

const OrdersAdminPage = () => {
    const [pedidos, setPedidos] = useState([]);
    const [filtro, setFiltro] = useState('TODOS');
    const [detailOrder, setDetailOrder] = useState(null);
    const [motivoRechazo, setMotivoRechazo] = useState('');

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/v1/ventas/todos/');
            setPedidos(res.data);
        } catch (_err) {
            console.error('Error fetching orders:', _err);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOrders();
    }, []);

    const handleAction = async (pedidoId, accion) => {
        if (accion === 'rechazar' && !motivoRechazo) {
            alert('Por favor ingresa un motivo de rechazo');
            return;
        }
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/v1/ventas/gestionar-pago/', {
                pedido_id: pedidoId,
                accion,
                motivo: motivoRechazo,
            });
            if (res.data.exito) {
                fetchOrders();
                setDetailOrder(null);
                setMotivoRechazo('');
            }
        } catch {
            alert('Error al procesar la acción');
        }
    };

    const filteredPedidos = pedidos.filter(p => filtro === 'TODOS' || p.estado === filtro);

    const renderProductosCell = pedido => {
        const names = (pedido.items || []).map(i => i.producto_nombre).filter(Boolean);
        const preview = names.length === 0
            ? '—'
            : names.length <= 2
                ? names.join(', ')
                : `${names[0]}, ${names[1]}`;
        const hasMore = names.length > 2;

        return (
            <button
                onClick={() => setDetailOrder(pedido)}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', gap: '6px', textAlign: 'left',
                }}
            >
                <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{preview}</span>
                {hasMore && (
                    <span style={{
                        fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)',
                        background: 'var(--surface-high)', borderRadius: '6px', padding: '2px 7px',
                    }}>
                        +{names.length - 2}
                    </span>
                )}
            </button>
        );
    };

    return (
        <div className="app-container animate-fade">
            <header style={{ marginBottom: '40px' }}>
                <p className="label-caps" style={{ color: 'var(--primary-green)', marginBottom: '8px' }}>Control de Ventas</p>
                <h1 className="display-lg" style={{ margin: 0 }}>Gestión de Pedidos</h1>
            </header>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }} className="hide-scrollbar">
                {['TODOS', 'PAGO_SUBIDO', 'PAGO_VERIFICADO', 'PAGO_RECHAZADO', 'DESPACHADO'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFiltro(f)}
                        style={{
                            padding: '10px 20px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700,
                            background: filtro === f ? 'var(--primary-green)' : 'var(--surface-high)',
                            color: filtro === f ? 'black' : 'var(--text-secondary)',
                            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: '0.2s',
                        }}
                    >
                        {f.replace(/_/g, ' ')}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--surface-low)', height: '50px' }}>
                        <tr>
                            <th style={{ padding: '0 24px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>ID / CLIENTE</th>
                            <th style={{ padding: '0 24px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>PRODUCTOS</th>
                            <th style={{ padding: '0 24px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>TOTAL</th>
                            <th style={{ padding: '0 24px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>ESTADO</th>
                            <th style={{ padding: '0 24px', textAlign: 'right', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPedidos.map(pedido => (
                            <tr key={pedido.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', height: '80px' }}>
                                <td style={{ padding: '0 24px' }}>
                                    <p style={{ fontWeight: 800, fontSize: '0.9rem', margin: 0 }}>#{pedido.id}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                                        {pedido.cliente || 'Invitado'}
                                    </p>
                                </td>
                                <td style={{ padding: '0 24px' }}>
                                    {renderProductosCell(pedido)}
                                </td>
                                <td style={{ padding: '0 24px', fontWeight: 700, color: 'var(--primary-green)' }}>
                                    ${fmt(pedido.final_total)}
                                </td>
                                <td style={{ padding: '0 24px' }}>
                                    <StatusBadge status={pedido.estado} />
                                </td>
                                <td style={{ padding: '0 24px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        {pedido.estado === 'PAGO_SUBIDO' && (
                                            <button
                                                onClick={() => handleAction(pedido.id, 'aprobar')}
                                                title="Aprobar pago"
                                                style={{
                                                    background: 'rgba(57, 181, 74, 0.15)', color: 'var(--primary-green)',
                                                    border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer',
                                                }}
                                            >
                                                <span className="material-icons-round">check</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setDetailOrder(pedido)}
                                            title="Ver detalle"
                                            style={{
                                                background: 'var(--surface-high)', color: 'var(--text-secondary)',
                                                border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer',
                                            }}
                                        >
                                            <span className="material-icons-round">open_in_new</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredPedidos.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px', opacity: 0.5 }}>
                        No hay pedidos en esta categoría
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {detailOrder && (
                    <OrderDetailModal
                        pedido={detailOrder}
                        motivoRechazo={motivoRechazo}
                        setMotivoRechazo={setMotivoRechazo}
                        onClose={() => { setDetailOrder(null); setMotivoRechazo(''); }}
                        onAction={handleAction}
                    />
                )}
            </AnimatePresence>

            {/* Navigation */}
            <nav className="bottom-nav">
                <Link to="/" className="nav-item">
                    <span className="material-icons-round">home</span>
                    <span>Inicio</span>
                </Link>
                <Link to="/admin/pedidos" className="nav-item active">
                    <span className="material-icons-round">shopping_bag</span>
                    <span>Ventas</span>
                </Link>
                <Link to="/admin/inventario" className="nav-item">
                    <span className="material-icons-round">inventory_2</span>
                    <span>Inventario</span>
                </Link>
            </nav>
        </div>
    );
};

export default OrdersAdminPage;
